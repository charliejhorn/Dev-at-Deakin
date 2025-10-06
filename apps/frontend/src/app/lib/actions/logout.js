"use server";

import { logoutDAL } from "@/app/lib/dal/auth";
import { cookies } from "next/headers";

function clearCookie(cookieStore, name) {
    if (!cookieStore) return;

    try {
        cookieStore.delete(name);
    } catch (e) {
        cookieStore.set(name, "", { expires: new Date(0), path: "/" });
    }
}

export async function logoutAction({
    requestCookies,
    responseCookies,
    baseUrl,
} = {}) {
    const opts = {
        baseUrl,
    };

    const requestStore = requestCookies ?? (await cookies());
    const responseStore = responseCookies ?? cookies();

    opts.cookieStore = requestStore;

    try {
        await logoutDAL(opts);
    } catch (e) {
        // ignore
    }

    clearCookie(responseStore, "accessToken");
    clearCookie(responseStore, "refreshToken");

    return { success: true };
}
