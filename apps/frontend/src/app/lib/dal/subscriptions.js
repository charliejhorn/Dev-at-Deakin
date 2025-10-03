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
        const { baseUrl = process.env.NEXT_PUBLIC_API_BASE, cookieStore } =
            options;

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
            console.log(
                "getSubscription error:",
                res.statusText,
                info?.error || info?.message
            );
            return null;
        }
        const data = await res.json();
        return data?.items?.[0] ?? null;
    } catch (e) {
        console.log("getSubscription error:", e);
        return null;
    }
}

export async function cancelSubscriptionDAL(options = {}) {
    const {
        subscriptionId,
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
        cookieStore,
    } = options;

    if (!subscriptionId) {
        throw new Error("subscription id is required to cancel subscription");
    }

    if (!baseUrl) {
        throw new Error("subscription api base url not configured");
    }

    const resolvedCookieStore = cookieStore || (await cookies());

    const response = await fetch(
        `${baseUrl}/api/subscriptions/${subscriptionId}`,
        {
            method: "PATCH",
            headers: withAuthHeaders(
                {
                    "Content-Type": "application/json",
                },
                resolvedCookieStore
            ),
            body: JSON.stringify({ status: "inactive" }),
        }
    );

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || info?.message || "failed to cancel subscription"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}
