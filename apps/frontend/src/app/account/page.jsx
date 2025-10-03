import Link from "next/link";
import { getUser } from "../lib/dal/user";
import ManageSubscription from "./ManageSubscription";

export default function AccountPage() {
    const user = getUser();

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
                    <div className="card-header">Account</div>
                    <div className="card-body">
                        <div>
                            Name: {user.firstName} {user.lastName}
                        </div>
                        <div>Email: {user.email}</div>
                        {/* {error && (
                            <div className="alert alert-warning mt-3">
                                {error}
                            </div>
                        )} */}
                    </div>
                </div>

                {/* manage subscription */}
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
                            {loading ? "Cancelling…" : "Cancel subscription"}
                        </button>
                    </div>
                </div>
                )} */}
                <ManageSubscription />

                <div className="d-flex justify-content-start mt-4">
                    <Link className="btn btn-outline-secondary" href="/logout">
                        Logout
                    </Link>
                </div>
            </div>
        </>
    );
}
