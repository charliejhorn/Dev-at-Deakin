import Link from "next/link";
import { getUser } from "../lib/dal/user";
import { getSubscription } from "../lib/dal/subscriptions";

export default async function PlansPage() {
    const user = await getUser();
    const subscription = await getSubscription(user?.email);
    const isActiveSubscription = subscription?.status === "active";

    // console.log("[PlansPage] subscription:", subscription);

    return (
        <div className="container p-5 text-center">
            <h1 className="pb-3">Subscription Plans</h1>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col">
                    <div className="card shadow">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">Free</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">
                                $0 <small className="text-muted">/ mo</small>
                            </h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>Create posts</li>
                                <li>Connect with students</li>
                            </ul>

                            {/* if user isn't logged in */}
                            {!user && (
                                <Link
                                    href="/signup"
                                    className="btn btn-lg btn-block btn-outline-primary"
                                >
                                    Get started
                                </Link>
                            )}

                            {/* if user is free */}
                            {user && !isActiveSubscription && (
                                <Link
                                    href="/signup"
                                    className="btn btn-lg btn-block btn-outline-primary disabled"
                                >
                                    Currently active
                                </Link>
                            )}

                            {/* if user is premium */}
                            {user && isActiveSubscription && (
                                <Link
                                    href="/account"
                                    className="btn btn-lg btn-block btn-outline-primary"
                                >
                                    Downgrade
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card shadow">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">Premium</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">
                                $15 <small className="text-muted">/ mo</small>
                            </h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>Messaging</li>
                                <li>Custom banners & themes</li>
                                <li>Content controls</li>
                                <li>Analytics dashboard</li>
                            </ul>

                            {/* if user isn't logged in */}
                            {!user && (
                                <Link
                                    href="/signup"
                                    className="btn btn-lg btn-block btn-primary"
                                >
                                    Get started
                                </Link>
                            )}

                            {/* if user is free */}
                            {user && !isActiveSubscription && (
                                <Link
                                    href="/checkout"
                                    className="btn btn-lg btn-block btn-primary"
                                >
                                    Upgrade
                                </Link>
                            )}

                            {/* if user is premium */}
                            {user && isActiveSubscription && (
                                <Link
                                    href="/account"
                                    className="btn btn-lg btn-block btn-primary disabled"
                                >
                                    Premium active
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
