// define api routes for auth and resources
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { initFirebase } = require("../lib/firebase");

// temporary workshop routes from initial scaffold
const {
    getWorkshops,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
} = require("../controllers");
router.get("/workshops", getWorkshops);
router.post("/workshops", createWorkshop);
router.put("/workshops/:id", updateWorkshop);
router.delete("/workshops/:id", deleteWorkshop);

// mount resource routers
router.use("/jobs", require("./jobs"));
router.use("/auth", require("./auth"));

// health check
router.get("/health", (req, res) => {
    res.json({ ok: true, ts: Date.now() });
});

// auth endpoints
const db = initFirebase();
if (!db) {
    // create a minimal router that returns service unavailable
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

// placeholder protected route example
router.get("/me", auth(true), (req, res) => {
    res.json({ user: req.user });
});

// enriched profile: fetch full user from firestore
router.get("/auth/me", auth(true), async (req, res) => {
    try {
        if (!db)
            return res.status(503).json({ error: "firestore not configured" });
        const userId = req.user?.sub;
        if (!userId)
            return res.status(400).json({ error: "invalid token payload" });
        const doc = await db.collection("users").doc(userId).get();
        if (!doc.exists)
            return res.status(404).json({ error: "user not found" });
        const data = doc.data();
        // sanitize: remove sensitive fields
        delete data.passwordHash;
        res.json({ id: doc.id, ...data });
    } catch (e) {
        res.status(500).json({ error: "internal_error" });
    }
});

module.exports = router;
