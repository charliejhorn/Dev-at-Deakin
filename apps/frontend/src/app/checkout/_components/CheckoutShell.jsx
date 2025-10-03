"use client";

import { useCallback, useMemo, useState } from "react";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutFlow from "./CheckoutFlow";
import { createCheckoutSessionAction } from "@/app/lib/actions/checkout";
import { DEFAULT_PRICE_ID } from "@/app/lib/config/checkout";

let stripePromise;

function getStripePromise(publishableKey) {
    if (!stripePromise) {
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
}

export default function CheckoutShell({ userEmail, priceId = DEFAULT_PRICE_ID }) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const [error, setError] = useState(null);

    const stripe = useMemo(() => {
        if (!publishableKey) return null;
        return getStripePromise(publishableKey);
    }, [publishableKey]);

    const fetchClientSecret = useCallback(async () => {
        try {
            const result = await createCheckoutSessionAction({ priceId });
            const clientSecret = result?.checkoutSessionClientSecret;
            if (!clientSecret) {
                throw new Error("missing checkout session client secret");
            }
            return clientSecret;
        } catch (err) {
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : "failed to start checkout";
            setError(message);
            return Promise.reject(err instanceof Error ? err : new Error(message));
        }
    }, [priceId]);

    if (!publishableKey) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    stripe publishable key not configured
                </div>
            </div>
        );
    }

    if (!stripe) {
        return (
            <div className="container mt-4">
                <p>loading checkout...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <CheckoutProvider stripe={stripe} options={{ fetchClientSecret }}>
            <CheckoutFlow userEmail={userEmail} />
        </CheckoutProvider>
    );
}
