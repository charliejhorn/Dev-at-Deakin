import { cookies } from "next/headers";

export async function validateSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken) {
        throw new Error("Access token is missing");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/me`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken.value}`,
            },
        }
    );

    if (!response.ok) {
        const error = new Error("Failed to validate session");
        error.status = response.status;
        error.info = await response.json().catch(() => ({}));
        throw error;
    }

    return await response.json();
}
