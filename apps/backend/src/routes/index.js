// define api routes for auth and resources
const express = require("express");
const router = express.Router();
const { initFirebase } = require("../lib/firebase");
const { getStripe } = require("../lib/stripe");

// mount resource routers
router.use("/auth", require("./auth"));

// health check
router.get("/health", (req, res) => {
    res.json({ ok: true, ts: Date.now() });
});

const db = initFirebase();
if (!db) {
    // create a minimal router that returns service unavailable
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

const stripe = getStripe();
if (!stripe) {
    // create a minimal router that returns service unavailable
    router.use((req, res) =>
        res.status(503).json({ error: "stripe not configured" })
    );
    module.exports = router;
    return;
}

module.exports = router;
