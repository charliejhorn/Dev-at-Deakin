import Link from "next/link";
import { getUser } from "@/app/lib/dal/user";

export default async function NavBar() {
    const user = await getUser();
    // console.log("NavBar user:", user);

    return (
        <>
            <nav className="navbar navbar-expand-sm bg-secondary-subtle">
                <div className="container-fluid">
                    <Link
                        href="/"
                        className="d-flex align-items-center gap-1 text-decoration-none"
                    >
                        <img
                            src="/egg.png"
                            className="img-fluid"
                            alt="egg logo"
                            style={{ height: "2em" }}
                        ></img>
                        <span className="navbar-brand">Dev@Deakin</span>
                    </Link>

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
                                    <Link
                                        className="nav-link text-black"
                                        href="/plans"
                                    >
                                        Plans
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link text-black"
                                        href="/posts/questions"
                                    >
                                        Find a Question
                                    </Link>
                                </li>

                                {
                                    // if user not logged in, display 'Login'
                                    user == null ? (
                                        <li className="nav-item">
                                            <Link
                                                className="nav-link text-black"
                                                href="/login"
                                            >
                                                Login
                                            </Link>
                                        </li>
                                    ) : (
                                        // if user logged in, display 'Create Post' and 'Logout'
                                        <>
                                            <li className="nav-item">
                                                <Link
                                                    className="nav-link text-black"
                                                    href="/posts/create"
                                                >
                                                    Create Post
                                                </Link>
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
