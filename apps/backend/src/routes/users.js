const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { initFirebase } = require("../lib/firebase");
const { httpError } = require("../lib/errors");

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
router.post("/", async (req, res, next) => {
    try {
        // accept firstName and lastName
        const { email, password, firstName, lastName } = req.body || {};
        const role = req.body?.role || "user";
        if (!email || !password)
            return next(httpError(400, "email and password are required"));
        const fn =
            typeof firstName === "string" && firstName.trim().length
                ? firstName.trim()
                : null;
        const ln =
            typeof lastName === "string" && lastName.trim().length
                ? lastName.trim()
                : null;

        // check existing user
        const q = await db
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();
        if (!q.empty) return next(httpError(409, "user already exists"));

        const hash = await bcrypt.hash(password, 10);
        const now = Date.now();
        const doc = {
            email,
            firstName: fn,
            lastName: ln,
            role: role || "customer",
            passwordHash: hash,
            createdAt: now,
            updatedAt: now,
        };
        const ref = await db.collection("users").add(doc);
        const out = {
            id: ref.id,
            email: doc.email,
            firstName: doc.firstName,
            lastName: doc.lastName,
            role: doc.role,
            createdAt: doc.createdAt,
        };
        return res.status(201).json(out);
    } catch (e) {
        console.log("e:", e);
        return next(httpError(500, "internal_error", e.message));
    }
});

module.exports = router;
