"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { tokens, logout } = useAuth();

    // allow public pages through without auth
    const publicPaths = ["/login", "/signup", "/logout"];
    const isPublic =
        !!pathname && publicPaths.some((p) => pathname.startsWith(p));

    // always call hooks in the same order; use a null key to disable fetching on public routes
    const swrKey = isPublic ? null : "/api/auth/me";
    const { data, error, isLoading } = useSWR(swrKey, {
        suspense: false,
        shouldRetryOnError: false,
    });

    useEffect(() => {
        // only guard non-public routes
        if (isPublic) return;

        // debug logs
        console.log("RequireAuth tokens:", tokens);
        console.log("requireAuth data:", data);
        console.log("requireAuth error", error);
        // console.log(
        //     data ? ("requireAuth data", data) : ("requireAuth error:", error)
        // );

        // if (!isLoading) {
        //     // logout when not authenticated (which will redirect to login)
        //     const email = data?.email ?? data?.user?.email;
        //     if (error || !email) {
        //         // router.replace("/login");
        //         // logout();
        //         router.replace("/logout");
        //     }
        // }
    }, [isLoading, data, error, router]);

    // render public routes immediately
    if (isPublic) return children;

    if (isLoading) return <p className="m-5">Authenticating...</p>;
    // when redirecting due to missing auth, avoid showing error flicker
    const email = data?.email ?? data?.user?.email;
    if (error || !email) return <p className="m-5">Error, or no email</p>;
    return children;
}
