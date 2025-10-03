"use client";

export default function ManageSubscription({ subscription }) {
    return (
        <div className="card mt-4">
            <div className="card-header">Manage Subscription</div>
            <div className="card-body">
                {subscription ? (
                    <>
                        <p className="text-secondary">
                            Your Premium plan is active. You can cancel your
                            subscription at any time.
                        </p>
                        <button
                            className="btn btn-outline-danger"
                            // onClick={handleCancel}
                            // disabled={loading}
                        >
                            {/* {loading ? "Cancelling…" : "Cancel subscription"} */}
                            Cancel subscription
                        </button>
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
