const express = require("express");
const router = express.Router();
const { initFirebase } = require("../lib/firebase");
const { httpError } = require("../lib/errors");
const { requireFields, allowOnly, isEnum } = require("../lib/validators");
const { emitJobStatus } = require("../lib/sse");

const db = initFirebase();
if (!db) {
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}
const COL = "jobs";
const STATUS = [
    "queued",
    "in_progress",
    "waiting_parts",
    "completed",
    "cancelled",
];

// list jobs (optional filters)
router.get("/", async (req, res, next) => {
    try {
        let q = db.collection(COL).orderBy("createdAt", "desc");
        if (req.query.status) q = q.where("status", "==", req.query.status);
        if (req.query.mechanic)
            q = q.where("mechanic", "==", req.query.mechanic);
        if (req.query.customer)
            q = q.where("customer", "==", req.query.customer);
        const limit = Math.min(Number(req.query.limit || 50), 200);
        q = q.limit(limit);
        const snap = await q.get();
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        res.json({ items: data });
    } catch (e) {
        next(e);
    }
});

// get one
router.get("/:id", async (req, res, next) => {
    try {
        const doc = await db.collection(COL).doc(req.params.id).get();
        if (!doc.exists) return next(httpError(404, "not found"));
        res.json({ id: doc.id, ...doc.data() });
    } catch (e) {
        next(e);
    }
});

// create
router.post("/", async (req, res, next) => {
    try {
        const allowed = [
            "title",
            "customer",
            "mechanic",
            "start",
            "end",
            "status",
            "notes",
        ];
        const data = allowOnly(req.body || {}, allowed);
        const err = requireFields(data, ["title", "customer"]);
        if (err) return next(httpError(400, err));
        data.status = isEnum(data.status, STATUS) ? data.status : "queued";
        const now = Date.now();
        data.createdAt = now;
        data.updatedAt = now;
        const ref = await db.collection(COL).add(data);
        res.status(201).json({ id: ref.id, ...data });
    } catch (e) {
        next(e);
    }
});

// update
router.patch("/:id", async (req, res, next) => {
    try {
        const allowed = [
            "title",
            "customer",
            "mechanic",
            "start",
            "end",
            "status",
            "notes",
        ];
        const patch = allowOnly(req.body || {}, allowed);
        if (patch.status && !isEnum(patch.status, STATUS))
            return next(httpError(400, "invalid status"));
        if (!Object.keys(patch).length)
            return next(httpError(400, "no valid fields"));
        patch.updatedAt = Date.now();
        const ref = db.collection(COL).doc(req.params.id);
        const old = await ref.get();
        if (!old.exists) return next(httpError(404, "not found"));
        await ref.update(patch);
        const merged = { id: ref.id, ...old.data(), ...patch };
        res.json(merged);
    } catch (e) {
        next(e);
    }
});

// status change (emit sse)
router.post("/:id/status", async (req, res, next) => {
    try {
        const { status } = req.body || {};
        if (!isEnum(status, STATUS))
            return next(httpError(400, "invalid status"));
        const ref = db.collection(COL).doc(req.params.id);
        const doc = await ref.get();
        if (!doc.exists) return next(httpError(404, "not found"));
        const ts = Date.now();
        await ref.update({ status, updatedAt: ts });
        // optionally append to status_logs
        try {
            await db
                .collection("status_logs")
                .add({ jobId: ref.id, status, ts });
        } catch (_) {
            /* ignore */
        }
        emitJobStatus({ id: ref.id, status, ts });
        res.json({ id: ref.id, status, ts });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
