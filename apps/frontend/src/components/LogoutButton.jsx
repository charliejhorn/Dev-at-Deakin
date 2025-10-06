"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/lib/actions/logout";

export default function LogoutButton({
    className = "btn btn-outline-secondary",
    children = "Logout",
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            await logoutAction();
            router.replace("/");
            router.refresh();
        });
    };

    return (
        <button
            type="button"
            className={className}
            onClick={handleClick}
            disabled={isPending}
        >
            {isPending ? "Logging out..." : children}
        </button>
    );
}
