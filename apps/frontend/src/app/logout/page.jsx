"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LogoutPage() {
    const router = useRouter();
    const { logout, user } = useAuth();

    useEffect(() => {
        let cancelled = false;

        const performLogout = async () => {
            try {
                await logout();
            } finally {
                console.log("finally logged out");
                if (!cancelled) router.replace("/login");
            }
        };

        performLogout();

        return () => {
            cancelled = true;
        };
    }, [logout, router]); // only depend on logout and router

    // const [loggedOut, setLoggedOut] = useState(false);

    // const performLogout = useCallback(async () => {
    //     let cancelled = false;
    //     try {
    //         await logout();
    //     } finally {
    //         console.log("finally logged out");
    //         if (!cancelled) router.replace("/login");
    //     }
    // }, [user, logout, router]);

    // useEffect(() => {
    //     performLogout();

    // // perform logout then redirect
    // let cancelled = false;
    // setLoggedOut(false);
    // if (!loggedOut) {
    //     (async () => {
    //         try {
    //             await logout();
    //         } finally {
    //             console.log("logout finally");
    //             setLoggedOut(true);
    //             if (!cancelled) router.replace("/login");
    //         }
    //     })();
    //     return () => {
    //         cancelled = true;
    //     };
    // }

    // (async () => {
    //     if (counter < 10) {
    //         console.log("counter:", counter);
    //         console.log("awaiting logout");
    //         await logout();
    //         console.log("logged out");
    //         router.push("/login");
    //         setCounter((prev) => prev + 1);
    //     }
    // })();
    // }, [performLogout]);

    return (
        <div className="container py-4">
            <p>signing you out…</p>
        </div>
    );
}
