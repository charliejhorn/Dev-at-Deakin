"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
    const { user } = useAuth();

    return (
        <>
            <nav className="navbar navbar-expand-sm bg-secondary-subtle">
                <div className="container-fluid">
                    <div className="d-flex align-items-center gap-1">
                        <img
                            src="/egg.png"
                            className="img-fluid"
                            alt="egg logo"
                            style={{ height: "2em" }}
                        ></img>
                        <a className="navbar-brand" href="/">
                            Dev@Deakin
                        </a>
                    </div>

                    <div className="text-end">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarLinks"
                            aria-controls="navbarLinks"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div
                            className="collapse navbar-collapse text-end"
                            id="navbarLinks"
                        >
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a
                                        className="nav-link text-black"
                                        href="/plans"
                                    >
                                        Plans
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link text-black"
                                        href="/find-question"
                                    >
                                        Find a Question
                                    </a>
                                </li>

                                {
                                    // if user not logged in, display 'Login'
                                    user == null ? (
                                        <li className="nav-item">
                                            <a
                                                className="nav-link text-black"
                                                href="/login"
                                            >
                                                Login
                                            </a>
                                        </li>
                                    ) : (
                                        // if user logged in, display 'Create Post' and 'Logout'
                                        <>
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link text-black"
                                                    href="/create-post"
                                                >
                                                    Create Post
                                                </a>
                                            </li>
                                            <li className="nav-item d-flex justify-content-end">
                                                <Link
                                                    className="nav-link text-black text-end"
                                                    href="/account"
                                                >
                                                    Account
                                                </Link>
                                            </li>
                                        </>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
