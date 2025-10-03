"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmCheckoutSessionAction } from "@/app/lib/actions/checkout";

export default function CheckoutCompleteClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function confirm() {
            const sessionId = searchParams.get("session_id");
            if (!sessionId) {
                setError("missing session_id in url");
                setLoading(false);
                return;
            }

            try {
                const result = await confirmCheckoutSessionAction({
                    sessionId,
                });
                if (cancelled) return;

                if (!result || result.error) {
                    const message =
                        typeof result?.error === "string"
                            ? result.error
                            : "failed to confirm session";
                    setError(message);
                    return;
                }

                setSubscription(result.subscription || null);
                router.prefetch("/account");
            } catch (err) {
                if (cancelled) return;
                const message =
                    err instanceof Error
                        ? err.message
                        : "failed to confirm session";
                setError(message);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        confirm();

        return () => {
            cancelled = true;
        };
    }, [router, searchParams]);

    const navigateAccount = () => {
        router.push("/account");
        router.refresh();
    };

    return (
        <div className="container mt-4">
            {loading && <p>Confirming your subscription...</p>}
            {!loading && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {!loading && !error && (
                <>
                    <h1>Subscription successful!</h1>
                    <div className="text-secondary">Dev@Deakin Premium</div>
                    {subscription?.currentPeriodEnd && (
                        <div className="text-secondary mt-2">
                            Active through {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </div>
                    )}
                    <button
                        type="button"
                        className="btn btn-secondary mt-3"
                        onClick={navigateAccount}
                    >
                        Go to account
                    </button>
                </>
            )}
        </div>
    );
}
