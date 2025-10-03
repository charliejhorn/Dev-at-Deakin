"use server";

import {
	createCheckoutSessionDAL,
	confirmCheckoutSessionDAL,
} from "@/app/lib/dal/checkout";
import { getUser } from "@/app/lib/dal/user";
import { DEFAULT_PRICE_ID } from "@/app/lib/config/checkout";

export async function createCheckoutSessionAction({
	priceId = DEFAULT_PRICE_ID,
} = {}) {
	const user = await getUser();

	if (!user?.email) {
		throw new Error("user email is required to start checkout");
	}

	return await createCheckoutSessionDAL({
		priceId,
		email: user.email,
	});
}

export async function confirmCheckoutSessionAction({ sessionId } = {}) {
	if (!sessionId) {
		throw new Error("session id is required to confirm checkout session");
	}

	return await confirmCheckoutSessionDAL({ sessionId });
}
