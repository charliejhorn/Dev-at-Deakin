"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
// import { cancelSubscription } from "../api/stripe";

export default function AccountPage() {
    // const { user, logout, setUserData } = useAuth();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCancel = async () => {
        // if (!user?.email || !user?.subscriptionStatus) return;
        // setLoading(true);
        // setError(null);
        // try {
        //     const res = await cancelSubscription({
        //         email: user.email,
        //         subscriptionId: user.subscriptionStatus,
        //         atPeriodEnd: false,
        //     });
        //     if (res?.ok) {
        //         // clear subscription status on the client
        //         setUserData({ subscriptionStatus: null });
        //     } else if (res?.error) {
        //         setError(res.error);
        //     } else if (res?.warning) {
        //         // even if sync failed, reflect as canceled locally so UI updates
        //         setUserData({ subscriptionStatus: null });
        //         setError(res.warning);
        //     }
        // } catch (e) {
        //     setError(e?.message || "failed to cancel subscription");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <>
            <div className="container my-5">
                <div className="card">
                    <div className="card-header">
                        {/* {user.firstName} {user.lastName} */}
                        user.firstName user.lastName
                    </div>
                    <div className="card-body">
                        {/* <div>Email: {user.email}</div> */}
                        <div>Email: user.email</div>
                        <div className="mt-3">
                            Subscription status:{" "}
                            {/* {user.subscriptionStatus
                                ? "Subscribed"
                                : "Not subscribed"} */}
                            TBD
                        </div>
                        {error && (
                            <div className="alert alert-warning mt-3">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* {user.subscriptionStatus && (
                    <div className="card mt-4">
                        <div className="card-header">Manage subscription</div>
                        <div className="card-body">
                            <p className="text-secondary">
                                Your Premium plan is active. You can cancel your
                                subscription at any time.
                            </p>
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                {loading
                                    ? "Cancelling…"
                                    : "Cancel subscription"}
                            </button>
                        </div>
                    </div>
                )} */}

                <div className="d-flex justify-content-start mt-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
