import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getUser } from "@/app/lib/dal/user";
import { getSubscription } from "@/app/lib/dal/subscriptions";
import CheckoutShell from "./_components/CheckoutShell";

export default async function CheckoutPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    const subscription = await getSubscription(user.email);
    if (subscription?.status === "active") {
        redirect("/account");
    }

    return (
        <>
            <CheckoutShell userEmail={user.email} />
        </>
    );
}
