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

export async function getSubscription(email, options = {}) {
    try {
        if (!email) return null;
        const params = new URLSearchParams({ email });
        const {
            baseUrl = process.env.NEXT_PUBLIC_API_BASE,
            cookieStore,
        } = options;

        if (!baseUrl) {
            throw new Error("subscription api base url not configured");
        }

        const resolvedCookieStore = cookieStore || (await cookies());

        const res = await fetch(
            `${baseUrl}/api/subscriptions?${params.toString()}`,
            {
                method: "GET",
                headers: withAuthHeaders({}, resolvedCookieStore),
            }
        );
        if (!res.ok) {
            let info = null;
            try {
                info = await res.json();
            } catch (err) {
                // ignore parse errors
            }
            console.log("getSubscription error:", res.statusText, info?.error || info?.message);
            return null;
        }
        const data = await res.json();
        return data?.items?.[0] ?? null;
    } catch (e) {
        console.log("getSubscription error:", e);
        return null;
    }
}
