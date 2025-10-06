import { redirect } from "next/navigation";
import { getUser } from "../lib/dal/user";
import ManageSubscription from "./ManageSubscription";
import { getSubscription } from "../lib/dal/subscriptions";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }

    const subscription = await getSubscription(user.email);

    return (
        <>
            <div className="container my-5">
                <div className="card">
                    <div className="card-header">Account</div>
                    <div className="card-body">
                        <p>
                            <strong>Name: </strong> {user.firstName}{" "}
                            {user.lastName}
                        </p>
                        <p className="mb-0">
                            <strong>Email:</strong> {user.email}
                        </p>
                    </div>
                </div>

                <ManageSubscription subscription={subscription} />

                <div className="d-flex justify-content-start mt-4">
                    <LogoutButton />
                </div>
            </div>
        </>
    );
}
