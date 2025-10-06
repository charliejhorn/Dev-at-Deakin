import "server-only";

import { validateSession } from "./auth";

// cached version
// export const getUser = cache(async () => {
//     try {
//         const user = await validateSession();
//         if (!user) return null;
//         return user;
//     } catch (e) {
//         console.log("getUser error:", e);
//     }
// });

// un-cached version
export async function getUser() {
    try {
        const user = await validateSession();
        if (!user) return null;
        return user;
    } catch (e) {
        console.log("getUser error:", e);
        // return null on failures so callers (eg. NavBar) treat as logged out
        return null;
    }
}

export async function signUpUser(user, options = {}) {
    const { baseUrl = process.env.NEXT_PUBLIC_API_BASE } = options;

    if (!user || typeof user !== "object") {
        throw new Error("user payload is required to sign up");
    }

    if (!baseUrl) {
        throw new Error("users api base url not configured");
    }

    const { email, password } = user;

    if (!email || !password) {
        throw new Error("email and password are required to sign up");
    }

    const payload = {
        email: email,
        password: password,
    };

    if (typeof user.firstName === "string" && user.firstName.trim()) {
        payload.firstName = user.firstName.trim();
    }

    if (typeof user.lastName === "string" && user.lastName.trim()) {
        payload.lastName = user.lastName.trim();
    }

    if (typeof user.role === "string" && user.role.trim()) {
        payload.role = user.role.trim();
    }

    const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const info = await response.json().catch(() => ({}));
        const error = new Error(
            info?.error || info?.message || "failed to sign up user"
        );
        error.status = response.status;
        error.info = info;
        throw error;
    }

    return await response.json();
}
