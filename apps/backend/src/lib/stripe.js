// initialize and export a singleton stripe client
let stripeClient = null;

function initStripe() {
    if (stripeClient) return stripeClient;
    try {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) return null;
        // require lazily so environments without stripe installed don't fail at require-time
        // eslint-disable-next-line global-require
        const Stripe = require("stripe");
        stripeClient = Stripe(key, {
            apiVersion: process.env.STRIPE_API_VERSION || "2025-03-31",
        });
        return stripeClient;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
            "stripe not initialized. set STRIPE_SECRET_KEY and install stripe."
        );
        return null;
    }
}

function getStripe() {
    return initStripe();
}

function resetForTests() {
    stripeClient = null;
}

module.exports = { initStripe, getStripe, resetForTests };
