import "server-only";

import { cookies } from "next/headers";
import { DEFAULT_PRICE_ID } from "@/app/lib/config/checkout";

function withAuthHeaders(headers = {}, cookieStore) {
    const accessToken = cookieStore?.get("accessToken")?.value;
    if (!accessToken) return headers;
    return {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
    };
}

export async function createCheckoutSessionDAL(options = {}) {
    const {
        priceId = DEFAULT_PRICE_ID,
        email,
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
        cookieStore,
    } = options;

    const resolvedCookieStore = cookieStore || (await cookies());
    if (!baseUrl) {
        throw new Error("checkout api base url not configured");
    }

    if (!email) {
        throw new Error("email is required to create checkout session");
    }

    const response = await fetch(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: withAuthHeaders(
            {
                "Content-Type": "application/json",
            },
            resolvedCookieStore
        ),
        body: JSON.stringify({ priceId, email }),
    });

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || "failed to create checkout session"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}

export async function confirmCheckoutSessionDAL(options = {}) {
    const {
        sessionId,
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
        cookieStore,
    } = options;

    const resolvedCookieStore = cookieStore || (await cookies());
    if (!baseUrl) {
        throw new Error("checkout api base url not configured");
    }

    if (!sessionId) {
        throw new Error("session id is required to confirm checkout session");
    }

    const params = new URLSearchParams({ session_id: sessionId });
    const response = await fetch(
        `${baseUrl}/api/checkout/confirm?${params.toString()}`,
        {
            method: "GET",
            headers: withAuthHeaders({}, resolvedCookieStore),
        }
    );

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || "failed to confirm checkout session"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}
