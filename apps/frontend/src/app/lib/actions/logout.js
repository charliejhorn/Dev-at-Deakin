"use server";

import { logoutDAL } from "@/app/lib/dal/auth";

function clearCookie(responseCookies, name) {
	if (!responseCookies) return;

	try {
		responseCookies.delete(name);
	} catch (e) {
		responseCookies.set(name, "", { expires: new Date(0), path: "/" });
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

	if (requestCookies) {
		opts.cookieStore = requestCookies;
	}

	try {
		await logoutDAL(opts);
	} catch (e) {
		// ignore
	}

	clearCookie(responseCookies, "accessToken");
	clearCookie(responseCookies, "refreshToken");

	return { success: true };
}
