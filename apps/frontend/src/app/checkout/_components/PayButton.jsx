"use client";

import { useCheckout } from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";

export default function PayButton({ email }) {
    const checkout = useCheckout();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const disabled = useMemo(() => {
        if (!checkout) return true;
        if (submitting) return true;
        const statusType = checkout?.status?.type;
        if (!statusType) return true;
        return statusType !== "open";
    }, [checkout, submitting]);

    const handleClick = useCallback(async () => {
        if (!checkout || typeof checkout.confirm !== "function") return;
        setSubmitting(true);
        setError(null);
        try {
            if (email && typeof checkout.updateEmail === "function") {
                const emailResult = await checkout.updateEmail(email);
                if (emailResult?.type === "error") {
                    setError(emailResult.error.message);
                    setSubmitting(false);
                    return;
                }
            }

            const result = await checkout.confirm({ email: email || undefined });
            if (result?.error) {
                setError(result.error.message || "payment failed");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "payment failed";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }, [checkout, email]);

    return (
        <div className="pt-3">
            <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
                disabled={disabled}
            >
                {submitting ? "Processing..." : "Pay now"}
            </button>
            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}
