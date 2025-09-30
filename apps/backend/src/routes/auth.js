const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { initFirebase } = require("../lib/firebase");

const db = initFirebase();
if (!db) {
    // create a minimal router that returns service unavailable
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

// register - create a new user in firestore with hashed password
router.post("/register", async (req, res) => {
    try {
        if (!db)
            return res.status(503).json({ error: "firestore not configured" });
        const { email, password, name } = req.body || {};
        // default role is 'user' for normal signup
        const role = req.body?.role || "user";
        if (!email || !password)
            return res
                .status(400)
                .json({ error: "email and password are required" });
        // check existing
        const q = await db
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();
        if (!q.empty)
            return res.status(409).json({ error: "user already exists" });
        const hash = await bcrypt.hash(password, 10);
        const now = Date.now();
        const doc = {
            email,
            name: name || null,
            role: role || "customer",
            passwordHash: hash,
            createdAt: now,
            updatedAt: now,
        };
        const ref = await db.collection("users").add(doc);
        const out = {
            id: ref.id,
            email: doc.email,
            name: doc.name,
            role: doc.role,
            createdAt: doc.createdAt,
        };
        return res.status(201).json(out);
    } catch (e) {
        return res.status(500).json({ error: "internal_error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        if (!db)
            return res.status(503).json({ error: "firestore not configured" });
        const { email, password } = req.body || {};
        if (!email || !password)
            return res
                .status(400)
                .json({ error: "email and password are required" });

        // lookup user
        const q = await db
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();
        if (q.empty)
            return res.status(401).json({ error: "invalid credentials" });
        const userDoc = q.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        const ok = await bcrypt.compare(password, user.passwordHash || "");
        if (!ok) return res.status(401).json({ error: "invalid credentials" });

        const accessTtl = Number(process.env.ACCESS_TOKEN_TTL || 900);
        const refreshTtl = Number(process.env.REFRESH_TOKEN_TTL || 2592000);
        const jti = uuidv4();
        const access = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: accessTtl }
        );
        const refresh = jwt.sign(
            { sub: user.id, jti },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET,
            { expiresIn: refreshTtl }
        );

        // persist refresh token record for rotation/revocation tracking
        try {
            const now = Date.now();
            await db
                .collection("refresh_tokens")
                .doc(jti)
                .set({
                    jti,
                    userId: user.id,
                    createdAt: now,
                    expiresAt: now + refreshTtl * 1000,
                    revoked: false,
                    replacedBy: null,
                });
        } catch (e) {
            // don't block login for persistence errors, but warn server logs
            // eslint-disable-next-line no-console
            console.warn("failed to persist refresh token", e?.message || e);
        }

        // header-only tokens: return tokens in JSON payload
        return res.json({
            accessToken: access,
            refreshToken: refresh,
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (e) {
        return res.status(500).json({ error: "internal_error" });
    }
});

router.post("/logout", (req, res) => {
    // revoke refresh token provided in body
    (async () => {
        try {
            const token = req.body?.refreshToken;
            if (!token || !db) return res.json({ ok: true });
            const payload = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET
            );
            const jti = payload.jti;
            if (jti)
                await db
                    .collection("refresh_tokens")
                    .doc(jti)
                    .update({ revoked: true });
            return res.json({ ok: true });
        } catch (e) {
            return res.json({ ok: true });
        }
    })();
});

router.post("/refresh", (req, res) => {
    try {
        const token = req.body?.refreshToken;
        if (!token) return res.status(401).json({ error: "unauthorized" });
        const payload = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET
        );
        const accessTtl = Number(process.env.ACCESS_TOKEN_TTL || 900);

        // rotation: verify jti exists and not revoked
        (async () => {
            try {
                if (!db)
                    return res
                        .status(503)
                        .json({ error: "firestore not configured" });
                const jti = payload.jti;
                if (!jti)
                    return res
                        .status(401)
                        .json({ error: "invalid refresh token" });
                const ref = db.collection("refresh_tokens").doc(jti);
                const doc = await ref.get();
                if (!doc.exists) {
                    // token reuse or unknown token detected: hard revoke all tokens for this user
                    // try best-effort to find by sub
                    const userId = payload.sub;
                    if (userId) {
                        const q = await db
                            .collection("refresh_tokens")
                            .where("userId", "==", userId)
                            .get();
                        const batch = db.batch();
                        q.docs.forEach((d) =>
                            batch.update(d.ref, { revoked: true })
                        );
                        await batch.commit();
                    }
                    return res
                        .status(401)
                        .json({ error: "invalid refresh token" });
                }
                const data = doc.data();
                if (data.revoked)
                    return res
                        .status(401)
                        .json({ error: "revoked refresh token" });

                // issue new tokens and rotate: create new jti, mark old token replaced
                const newJti = uuidv4();
                const newRefresh = jwt.sign(
                    { sub: payload.sub, jti: newJti },
                    process.env.JWT_REFRESH_SECRET ||
                        process.env.JWT_ACCESS_SECRET,
                    {
                        expiresIn: Number(
                            process.env.REFRESH_TOKEN_TTL || 2592000
                        ),
                    }
                );
                const access = jwt.sign(
                    { sub: payload.sub, role: payload.role },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: accessTtl }
                );

                // persist new refresh token and mark old as replaced
                const now = Date.now();
                const batch = db.batch();
                batch.set(db.collection("refresh_tokens").doc(newJti), {
                    jti: newJti,
                    userId: payload.sub,
                    createdAt: now,
                    expiresAt:
                        now +
                        Number(process.env.REFRESH_TOKEN_TTL || 2592000) * 1000,
                    revoked: false,
                    replacedBy: null,
                });
                batch.update(ref, { revoked: true, replacedBy: newJti });
                await batch.commit();

                // header-only tokens: return tokens in JSON payload
                return res.json({
                    accessToken: access,
                    refreshToken: newRefresh,
                });
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn("refresh rotation error", e?.message || e);
                return res.status(401).json({ error: "unauthorized" });
            }
        })();
    } catch (e) {
        return res.status(401).json({ error: "unauthorized" });
    }
});

module.exports = router;
