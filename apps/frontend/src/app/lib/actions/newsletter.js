"use server";

import { subscribeNewsletterDAL } from "@/app/lib/dal/newsletter";

export async function subscribeNewsletterAction({ email } = {}) {
    const normalizedEmail = typeof email === "string" ? email.trim() : "";

    if (!normalizedEmail) {
        throw new Error("email is required to subscribe to newsletter");
    }

    return await subscribeNewsletterDAL({ email: normalizedEmail });
}
