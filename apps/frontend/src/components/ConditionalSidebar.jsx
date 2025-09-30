"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
    const pathname = usePathname();

    // list of paths where sidebar should not be shown
    const authPaths = ["/login", "/logout", "/signup"];

    // check if current path is an auth page
    const isAuthPage = authPaths.includes(pathname);

    // don't render sidebar on auth pages
    if (isAuthPage) {
        return null;
    }

    return <Sidebar />;
}
