"use client";

import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import EmailInput from "./EmailInput";
import PayButton from "./PayButton";
import { useEffect, useState } from "react";

function renderAmount(total) {
    const amount = total?.total?.amount;
    const currency = total?.total?.currency;
    if (!amount || !currency) return null;
    try {
        const formatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        });
        return formatter.format(amount / 100);
    } catch (e) {
        return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
    }
}

export default function CheckoutFlow({ userEmail }) {
    const checkoutState = useCheckout();
    const [email, setEmail] = useState(userEmail || "");

    useEffect(() => {
        setEmail(userEmail || "");
    }, [userEmail]);

    if (!checkoutState) {
        return (
            <div className="container mt-4">
                <p>loading checkout...</p>
            </div>
        );
    }

    if (checkoutState.status.type === "errored") {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {checkoutState.status.message || "failed to load checkout"}
                </div>
            </div>
        );
    }

    if (checkoutState.status.type !== "open") {
        return (
            <div className="container mt-4">
                <p>preparing checkout...</p>
            </div>
        );
    }

    const displayAmount = renderAmount(checkoutState.total);

    return (
        <div className="container mt-4">
            <h1>Subscribe to Dev@Deakin Premium</h1>
            {displayAmount && (
                <h4 className="text-secondary">{displayAmount} per month</h4>
            )}

            <h4 className="pt-4">Billing details</h4>
            <form>
                <EmailInput email={email} onEmailChange={setEmail} />
            </form>

            <h4 className="pt-3">Payment</h4>
            <PaymentElement options={{ layout: "accordion" }} />

            <PayButton email={email} />
        </div>
    );
}
