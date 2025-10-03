"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cancelSubscriptionAction } from "@/app/lib/actions/subscriptions";

export default function ManageSubscription({ subscription }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isActive = useMemo(() => {
        return subscription?.status === "active";
    }, [subscription]);

    const subscriptionId = useMemo(() => {
        if (!isActive) return null;
        return subscription?.id ?? subscription?._id ?? null;
    }, [subscription, isActive]);

    const handleCancel = async () => {
        if (!subscriptionId || loading) return;
        setError(null);
        setLoading(true);
        try {
            await cancelSubscriptionAction({ subscriptionId });
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "failed to cancel subscription";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header">Manage Subscription</div>
            <div className="card-body">
                {isActive ? (
                    <>
                        <p className="text-secondary">
                            Your Premium plan is active. You can cancel your
                            subscription at any time.
                        </p>
                        <button
                            className="btn btn-outline-danger"
                            onClick={handleCancel}
                            disabled={loading || !subscriptionId}
                        >
                            {loading ? "Cancelling…" : "Cancel subscription"}
                        </button>
                        {error && (
                            <div
                                className="alert alert-danger mt-3"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-secondary mb-0">
                            You do not have an active Dev@Deakin subscription.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
