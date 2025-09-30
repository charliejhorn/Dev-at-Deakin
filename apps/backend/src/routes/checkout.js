const express = require("express");
const router = express.Router();
const { initFirebase } = require("../lib/firebase");
const { getStripe } = require("../lib/stripe");
const { httpError } = require("../lib/errors");

const db = initFirebase();
const stripe = getStripe();

if (!db) {
    router.use((req, res) =>
        res.status(503).json({ error: "firestore not configured" })
    );
    module.exports = router;
    return;
}

if (!stripe) {
    router.use((req, res) =>
        res.status(503).json({ error: "stripe not configured" })
    );
    module.exports = router;
    return;
}

// create checkout session for subscription
router.post("/", async (req, res, next) => {
    try {
        const { priceId, email } = req.body || {};

        if (!email || typeof email !== "string")
            return next(httpError(400, "missing email for checkout session"));

        // block if user already has an active subscription
        try {
            const q = await db
                .collection("subscriptions")
                .where("email", "==", email)
                .where("status", "==", "active")
                .limit(1)
                .get();
            if (!q.empty)
                return next(
                    httpError(409, "user already has an active subscription")
                );
        } catch (e) {
            return next(
                httpError(
                    500,
                    "failed to validate subscription status",
                    e.message
                )
            );
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId || "price_1S9LISHboPoYLsIyDQj7iXfp",
                    quantity: 1,
                },
            ],
            mode: "subscription",
            ui_mode: "custom",
            // The URL of your payment completion page
            return_url:
                process.env.CHECKOUT_RETURN_URL ||
                `http://localhost:3000/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
        });

        res.json({ checkoutSessionClientSecret: session.client_secret });
    } catch (e) {
        next(e);
    }
});

// confirm a checkout session, verify payment, and persist subscription in firestore
router.get("/confirm", async (req, res, next) => {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId || typeof sessionId !== "string")
            return next(httpError(400, "missing or invalid session_id"));

        // retrieve and expand related resources
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["subscription", "customer"],
        });

        if (!session) return next(httpError(404, "session not found"));
        if (session.mode !== "subscription")
            return next(httpError(400, "session is not for a subscription"));

        // ensure payment completed
        const isPaid =
            session.payment_status === "paid" ||
            session.payment_status === "no_payment_required";
        const isComplete = session.status === "complete";
        if (!isComplete || !isPaid)
            return next(httpError(409, "payment not completed"));

        // normalise subscription object
        const sub =
            session.subscription && typeof session.subscription === "object"
                ? session.subscription
                : null;

        const subscriptionId =
            sub?.id ||
            (typeof session.subscription === "string"
                ? session.subscription
                : undefined);
        if (!subscriptionId)
            return next(
                httpError(500, "subscription not available on session")
            );

        // extract key fields for persistence
        const subscriptionDoc = {
            id: subscriptionId,
            status: sub?.status || null,
            stripeCustomerId:
                session.customer && typeof session.customer === "object"
                    ? session.customer.id
                    : session.customer || null,
            email:
                session.customer_details?.email ||
                (session.customer && typeof session.customer === "object"
                    ? session.customer.email
                    : null) ||
                null,
            priceId: sub?.items?.data?.[0]?.price?.id || null,
            productId: sub?.items?.data?.[0]?.price?.product || null,
            currentPeriodStart: sub?.current_period_start
                ? new Date(sub.current_period_start * 1000).toISOString()
                : null,
            currentPeriodEnd: sub?.current_period_end
                ? new Date(sub.current_period_end * 1000).toISOString()
                : null,
            createdAt: sub?.created
                ? new Date(sub.created * 1000).toISOString()
                : new Date().toISOString(),
            checkoutSessionId: session.id,
        };

        // persist subscription using shared service (also updates user doc where possible)
        try {
            const {
                upsertSubscription,
            } = require("../lib/subscriptionsService");
            await upsertSubscription(subscriptionDoc);
        } catch (err) {
            return next(err);
        }

        return res.json({ ok: true, subscription: subscriptionDoc });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
