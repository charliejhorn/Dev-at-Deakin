"use client";

import { useCheckout } from "@stripe/react-stripe-js";
import { useCallback, useEffect, useState } from "react";

export default function EmailInput({ email, onEmailChange }) {
    const checkout = useCheckout();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!checkout || typeof checkout.session !== "function") return;
        try {
            const session = checkout.session();
            if (session?.email && session.email !== email) {
                onEmailChange(session.email);
            }
        } catch (e) {
            // ignore session retrieval issues
        }
    }, [checkout, email, onEmailChange]);

    const handleChange = useCallback(
        (event) => {
            onEmailChange(event.target.value);
            setError(null);
        },
        [onEmailChange]
    );

    const handleBlur = useCallback(async () => {
        if (!checkout || !email || typeof checkout.updateEmail !== "function") return;
        try {
            const result = await checkout.updateEmail(email);
            if (result?.type === "error") {
                setError(result.error.message);
            } else {
                setError(null);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "failed to update email";
            setError(message);
        }
    }, [checkout, email]);

    return (
        <div className="mb-3">
            <label className="form-label" htmlFor="checkout-email">
                Email
            </label>
            <input
                id="checkout-email"
                type="email"
                className="form-control"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
            />
            {error && (
                <div className="text-danger small mt-1" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}
