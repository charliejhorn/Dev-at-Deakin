import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

export const validateSession = cache(async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken) {
        return null;
    }

    // api/users/me checks access token and returns the user object if valid
    const makeMeRequest = async () => {
        return await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken.value}`,
            },
        });
    };
    const initialResponse = await makeMeRequest();

    // console.log("[validateSession] initialResponse:", initialResponse);

    // if initial validation unsuccesful, attempt to refresh tokens
    if (!initialResponse.ok) {
        console.log(
            "[validateSesson] initial validation unsuccessful, attempting refresh"
        );
        try {
            await refreshTokens();

            const afterRefreshResponse = await makeMeRequest();
            if (!afterRefreshResponse.ok) {
                throw new Error(
                    "Session validation failed after token refresh"
                );
            }
            return await afterRefreshResponse.json();
        } catch (e) {
            const error = new Error("Failed to validate session");
            error.cause = e;
            throw error;
        }
    }

    return await initialResponse.json();
});

export async function loginDAL(email, password, opts = {}) {
    const {
        cookieStore = await cookies(),
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
    } = opts;

    const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const info = await res.json().catch(() => ({}));
        const err = new Error(info?.message || "login failed");
        err.status = res.status;
        throw err;
    }

    const data = await res.json();

    return data;
}

export async function logoutDAL(opts = {}) {
    console.log("[logoutDAL] logging out");

    const {
        cookieStore = await cookies(),
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
    } = opts;

    try {
        const refreshToken = cookieStore.get("refreshToken")?.value;
        if (refreshToken) {
            await fetch(`${baseUrl}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            }).catch(() => {});
        }
    } finally {
        try {
            cookieStore.set("accessToken", null);
            cookieStore.set("refreshToken", null);
        } catch (e) {
            // ignore
        }
    }
}

export async function refreshTokens(opts = {}) {
    const {
        cookieStore = await cookies(),
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
    } = opts;

    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) return null;

    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    try {
        cookieStore.set("accessToken", data.accessToken);
        cookieStore.set("refreshToken", data.refreshToken);
    } catch (e) {
        // ignore
    }

    return data;
}
