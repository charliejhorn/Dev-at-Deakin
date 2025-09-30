const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { initFirebase } = require("../lib/firebase");
const { httpError } = require("../lib/errors");
const { requireFields } = require("../lib/validators");

const db = initFirebase();
if (!db) {
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

router.post("/subscribe", async (req, res, next) => {
    try {
        const err = requireFields(req.body || {}, ["email"]);
        if (err) return next(httpError(400, err));

        const { email } = req.body;
        if (typeof email !== "string" || !email.includes("@"))
            return next(httpError(400, "invalid email"));

        // create subscription document with Firestore-generated id (pre-generated locally)
        const ref = db.collection("newsletter").doc();
        const id = ref.id;
        const subscription = {
            email,
            createdAt: Date.now(),
            id,
        };

        try {
            await ref.set(subscription);
            // eslint-disable-next-line no-console
            console.log("Firestore: Subscription saved successfully!", id);
        } catch (error) {
            // delegate to error handler
            return next(error);
        }

        // send confirmation email (configure via env)
        const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
        const GMAIL_USER = process.env.GMAIL_USER;
        if (GMAIL_APP_PASSWORD && GMAIL_USER) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: GMAIL_USER,
                    pass: GMAIL_APP_PASSWORD,
                },
            });
            const mailOptions = {
                from: `"Newsletter" <${GMAIL_USER}>`,
                to: email,
                subject: "Subscription Confirmation",
                text: "Welcome!\nThank you for subscribing to our newsletter!",
            };
            try {
                await transporter.sendMail(mailOptions);
            } catch (err) {
                // log and continue — don't fail subscription for mail send errors
                // eslint-disable-next-line no-console
                console.error("newsletter: email send failed", err);
            }
        }

        res.status(201).json({
            message: `${email} has been subscribed successfully!`,
        });
    } catch (error) {
        next(error);
    }
});
