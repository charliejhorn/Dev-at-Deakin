"use server";

import { cancelSubscriptionDAL } from "@/app/lib/dal/subscriptions";

export async function cancelSubscriptionAction({ subscriptionId } = {}) {
    if (!subscriptionId) {
        throw new Error("subscription id is required to cancel subscription");
    }

    return await cancelSubscriptionDAL({ subscriptionId });
}
