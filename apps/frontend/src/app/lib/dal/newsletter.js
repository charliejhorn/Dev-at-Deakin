import "server-only";

import { cookies } from "next/headers";

function withAuthHeaders(headers = {}, cookieStore) {
    const accessToken = cookieStore?.get("accessToken")?.value;
    if (!accessToken) return headers;
    return {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
    };
}

export async function subscribeNewsletterDAL(options = {}) {
    const {
        email,
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
        cookieStore,
    } = options;

    if (!email) {
        throw new Error("email is required to subscribe to newsletter");
    }

    if (!baseUrl) {
        throw new Error("newsletter api base url not configured");
    }

    const resolvedCookieStore = cookieStore || (await cookies());

    const response = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
        method: "POST",
        headers: withAuthHeaders(
            {
                "Content-Type": "application/json",
            },
            resolvedCookieStore
        ),
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || info?.message || "failed to subscribe to newsletter"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    const data = await response.json().catch(() => ({}));
    return data;
}
