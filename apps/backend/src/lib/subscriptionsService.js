const { initFirebase } = require("./firebase");
const { httpError } = require("../lib/errors");

const db = initFirebase();

async function upsertSubscription(subscriptionDoc) {
    if (!db) throw httpError(503, "firestore not configured");
    if (!subscriptionDoc || !subscriptionDoc.id)
        throw httpError(400, "invalid subscription document");

    const id = subscriptionDoc.id;
    try {
        await db.collection("subscriptions").doc(id).set(subscriptionDoc);
    } catch (e) {
        throw e;
    }

    // update user document with subscription id if email present
    if (subscriptionDoc.email) {
        try {
            const uq = await db
                .collection("users")
                .where("email", "==", subscriptionDoc.email)
                .limit(1)
                .get();
            if (!uq.empty) {
                const userRef = db.collection("users").doc(uq.docs[0].id);
                await userRef.update({
                    subscriptionStatus: subscriptionDoc.id,
                });
            }
        } catch (e) {
            // swallow user update errors — subscription persisted is primary
        }
    }

    return subscriptionDoc;
}

async function updateSubscription(id, patch) {
    if (!db) throw httpError(503, "firestore not configured");
    if (!id || !patch || !Object.keys(patch).length)
        throw httpError(400, "invalid patch");
    const ref = db.collection("subscriptions").doc(id);
    const old = await ref.get();
    if (!old.exists) throw httpError(404, "not found");
    patch.updatedAt = Date.now();
    await ref.update(patch);
    return { id: ref.id, ...old.data(), ...patch };
}

module.exports = {
    upsertSubscription,
    updateSubscription,
};
