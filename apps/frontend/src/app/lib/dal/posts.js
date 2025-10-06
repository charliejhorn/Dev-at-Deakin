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

export async function createPostDAL(options = {}) {
    const {
        post,
        baseUrl = process.env.NEXT_PUBLIC_API_BASE,
        cookieStore,
    } = options;

    if (!post || typeof post !== "object") {
        throw new Error("post payload is required to create post");
    }

    if (!baseUrl) {
        throw new Error("posts api base url not configured");
    }

    const resolvedCookieStore = cookieStore || (await cookies());

    const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: withAuthHeaders(
            {
                "Content-Type": "application/json",
            },
            resolvedCookieStore
        ),
        body: JSON.stringify(post),
    });

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || info?.message || "failed to create post"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}

export async function fetchQuestionsDAL(options = {}) {
    const { baseUrl = process.env.NEXT_PUBLIC_API_BASE, cookieStore } = options;

    if (!baseUrl) {
        throw new Error("posts api base url not configured");
    }

    const resolvedCookieStore = cookieStore || (await cookies());

    const url = new URL("/api/posts", baseUrl);
    url.searchParams.set("postType", "question");

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: withAuthHeaders({}, resolvedCookieStore),
        cache: "no-store",
    });

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || info?.message || "failed to fetch questions"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}
