const express = require("express");
const router = express.Router();
const { httpError } = require("../lib/errors");
const { requireFields, allowOnly } = require("../lib/validators");
const { updateSubscription } = require("../lib/subscriptionsService");

// list subscriptions (filter by email or status)
router.get("/", auth(true), async (req, res, next) => {
    try {
        const { email, status } = req.query || {};
        let q = null;
        const db = require("../lib/firebase").initFirebase();
        if (!db) return next(httpError(503, "firestore not configured"));
        q = db.collection("subscriptions").orderBy("createdAt", "desc");
        if (email) q = q.where("email", "==", email);
        if (status) q = q.where("status", "==", status);
        const limit = Math.min(Number(req.query.limit || 50), 200);
        q = q.limit(limit);
        const snap = await q.get();
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        res.json({ items });
    } catch (e) {
        next(e);
    }
});

// patch subscription
router.patch("/:id", auth(true), async (req, res, next) => {
    try {
        const allowed = ["status"];
        const patch = allowOnly(req.body || {}, allowed);
        if (!Object.keys(patch).length)
            return next(httpError(400, "no valid fields"));
        const updated = await updateSubscription(req.params.id, patch);
        res.json(updated);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
