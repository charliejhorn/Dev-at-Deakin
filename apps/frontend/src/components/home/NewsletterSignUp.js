"use client";

import { useState } from "react";
import { subscribeNewsletterAction } from "@/app/lib/actions/newsletter";

export default function NewsletterSignUp() {
    const [email, setEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubscribeStatus("wait");
        setErrorMessage(null);

        try {
            await subscribeNewsletterAction({ email });
            setSubscribeStatus("success");
            setEmail("");
        } catch (error) {
            setSubscribeStatus("error");
            const message =
                error instanceof Error ? error.message : "subscription failed";
            setErrorMessage(message);
        }
    };

    const subscribeStatusColor = () => {
        switch (subscribeStatus) {
            case "success":
                return "success";
            case "error":
                return "danger";
            case "wait":
                return "warning";
        }
    };

    const subscribeStatusText = () => {
        switch (subscribeStatus) {
            case "success":
                return "Subscription successful!";
            case "error":
                return errorMessage || "Subscription failed :(";
            case "wait":
                return "Subscribing...";
        }
    };

    return (
        <>
            <div className="container-fluid d-flex bg-secondary-subtle justify-content-between p-3 mt-5">
                <h2 className="text-start">SIGN UP FOR OUR DAILY INSIDER</h2>
                <div className="d-flex flex-column position-relative">
                    <form
                        className="d-flex"
                        role="search"
                        onSubmit={handleSubmit}
                    >
                        <input
                            className="form-control me-2"
                            type="email"
                            placeholder="Enter your email"
                            aria-label="email-enter"
                            value={email}
                            onChange={handleChange}
                        />
                        <button
                            className="btn btn-secondary"
                            type="submit"
                            disabled={subscribeStatus === "wait"}
                        >
                            Subscribe
                        </button>
                    </form>
                    {subscribeStatus !== null && (
                        <div
                            className="text-center position-absolute end-0 subscriptionStatus w-auto"
                            style={{ whiteSpace: "nowrap" }}
                        >
                            <div
                                className={`p-2 rounded bg-${subscribeStatusColor()}-subtle`}
                            >
                                {subscribeStatusText()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
