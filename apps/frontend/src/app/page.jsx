"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function HomePage() {
    const recent = Array.from({ length: 5 }).map((_, i) => ({
        title: `Brake Repair - Trek 7.${i + 1}`,
        customer: "John Smith",
        status:
            i % 3 === 0 ? "Queued" : i % 3 === 1 ? "In Progress" : "Completed",
    }));

    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4">Dashboard</h2>
            </div>
            <Link className="btn btn-secondary" href="/jobs">
                View Jobs
            </Link>
        </div>
    );
}
