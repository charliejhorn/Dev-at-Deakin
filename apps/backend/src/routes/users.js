const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { initFirebase } = require("../lib/firebase");

// initialize firestore (may return null if not configured)
const db = initFirebase();
if (!db) {
    // return service unavailable if firestore not configured
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

// create a new user (registration)
router.post("/", async (req, res) => {
    try {
        const { email, password, name } = req.body || {};
        const role = req.body?.role || "user";
        if (!email || !password)
            return res
                .status(400)
                .json({ error: "email and password are required" });

        // check existing user
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

module.exports = router;
