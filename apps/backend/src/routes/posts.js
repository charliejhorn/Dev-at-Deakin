const express = require("express");
const router = express.Router();
const { initFirebase } = require("../lib/firebase");
const { httpError } = require("../lib/errors");
const { requireFields, allowOnly, isEnum } = require("../lib/validators");

const db = initFirebase();
if (!db) {
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

const COL = "posts";
const POST_TYPES = ["question", "article"];

// list posts (optional filters)
router.get("/", async (req, res, next) => {
    try {
        let q = db.collection(COL).orderBy("createdAt", "desc");
        if (req.query.status) q = q.where("status", "==", req.query.status);
        if (req.query.postType)
            q = q.where("postType", "==", req.query.postType);
        if (req.query.createdBy)
            q = q.where("createdBy.id", "==", req.query.createdBy);
        const limit = Math.min(Number(req.query.limit || 50), 200);
        q = q.limit(limit);
        const snap = await q.get();
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        res.json({ items: data });
    } catch (e) {
        next(e);
    }
});

// create a post
router.post("/", auth(true), async (req, res, next) => {
    try {
        const allowed = [
            "postType",
            "title",
            "tags",
            "createdBy",
            "image",
            "questionDescription",
            "questionDescriptionUseMarkdown",
            "questionCodeSnippet",
            "articleAbstract",
            "articleText",
            "status",
        ];
        const data = allowOnly(req.body || {}, allowed);
        const err = requireFields(data, ["postType", "title"]);
        if (err) return next(httpError(400, err));
        if (!isEnum(data.postType, POST_TYPES))
            return next(httpError(400, "invalid postType"));
        const now = Date.now();
        data.createdAt = data.createdAt || now;
        data.updatedAt = now;
        const ref = await db.collection(COL).add(data);
        res.status(201).json({ id: ref.id, ...data });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
