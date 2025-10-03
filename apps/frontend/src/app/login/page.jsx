"use client";

import { useTransition, useActionState, useState } from "react";
import { loginAction } from "@/app/lib/actions/auth";
import Link from "next/link";

export default function LoginPage() {
    const [state, action] = useActionState(loginAction, undefined);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [pending, startTransition] = useTransition();
    // const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();

        // console.log("LoginPage params:", email, password);

        startTransition(async () => {
            // await action(formData.email, formData.password);
            //     await action(state, {
            //     email: formData.email,
            //     password: formData.password,
            // });
            await action({
                email: formData.email,
                password: formData.password,
            });
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // clear error when user starts typing
        // if (errors[name]) {
        //     setErrors((prev) => ({
        //         ...prev,
        //         [name]: "",
        //     }));
        // }
    };

    return (
        <>
            <div className="text-center p-5">
                <div className="container-fluid text-start w-75 border rounded p-4 shadow blur">
                    <div className="d-flex justify-content-between align-items-start">
                        <h2>Login to Dev@Deakin</h2>
                        <Link
                            className="btn btn-outline-secondary h-auto"
                            href="/signup"
                        >
                            Sign up
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className={`form-control${
                                    state?.errors?.email ? " is-invalid" : ""
                                }`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                aria-describedby="emailHelp"
                            />
                            {state?.errors?.email && (
                                <div className="invalid-feedback">
                                    {state?.errors?.email}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className={`form-control${
                                    state?.errors?.password ? " is-invalid" : ""
                                }`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {state?.errors?.password && (
                                <div className="invalid-feedback">
                                    {state?.errors?.password}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="mt-3 btn btn-primary"
                            disabled={
                                !formData.email || !formData.password || pending
                            }
                        >
                            {pending ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    {state?.message && (
                        <div
                            className={`mt-3 alert ${
                                state?.message.includes("successful")
                                    ? "alert-success"
                                    : "alert-danger"
                            }`}
                        >
                            {state?.message}
                        </div>
                    )}

                    {state?.message.includes("successful") && (
                        <Link className="btn btn-primary" href="/">
                            Go to Home
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
