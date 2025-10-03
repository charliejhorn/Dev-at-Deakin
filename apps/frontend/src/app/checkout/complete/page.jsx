import { Suspense } from "react";
import CheckoutCompleteClient from "./CheckoutCompleteClient";

export default function CheckoutCompletePage() {
    return (
        <Suspense
            fallback={
                <div className="container mt-4">
                    <p>Loading your subscription status...</p>
                </div>
            }
        >
            <CheckoutCompleteClient />
        </Suspense>
    );
}
