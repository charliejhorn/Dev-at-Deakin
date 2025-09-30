import React from "react";
import Link from "next/link";

export default function Sidebar() {
    return (
        <nav
            className="d-flex flex-column gap-2 p-3 border-end"
            style={{ minWidth: 240 }}
            aria-label="Primary"
        >
            <div className="d-flex align-items-center mb-2">
                <span className="fw-bold">CogWorks</span>
            </div>
            <Link className="btn btn-light text-start" href="/create-job">
                Create Job
            </Link>
            <hr className="my-2 mx-4" />
            <Link className="btn btn-light text-start" href="/">
                Dashboard
            </Link>
            <Link className="btn btn-light text-start" href="/jobs">
                Jobs
            </Link>
            <div className="mt-auto pt-3">
                <Link className="btn btn-light text-start" href="/logout">
                    Logout
                </Link>
            </div>
        </nav>
    );
}
