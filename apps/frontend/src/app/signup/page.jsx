"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/lib/actions/auth";

export default function SignUpPage() {
    const [state, action] = useActionState(signUpAction, undefined);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [pending, startTransition] = useTransition();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        startTransition(async () => {
            await action({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
        });
    }

    return (
        <>
            <div className="text-center p-5">
                <div className="container-fluid text-start w-75 border rounded p-4 shadow blur">
                    <div className="d-flex justify-content-between align-items-start">
                        <h2>Sign up for CogWorks</h2>
                        <Link
                            className="btn btn-outline-secondary"
                            href="/login"
                        >
                            Login
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row d-flex gap-2">
                            <div className="form-group mt-3 flex-fill">
                                <label htmlFor="firstName">First name*</label>
                                <input
                                    type="text"
                                    className={`form-control${
                                        state?.errors?.firstName
                                            ? " is-invalid"
                                            : ""
                                    }`}
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {state?.errors?.firstName && (
                                    <div className="invalid-feedback">
                                        {state?.errors?.firstName}
                                    </div>
                                )}
                            </div>
                            <div className="form-group mt-3 flex-fill">
                                <label htmlFor="lastName">Last name*</label>
                                <input
                                    type="text"
                                    className={`form-control${
                                        state?.errors?.lastName
                                            ? " is-invalid"
                                            : ""
                                    }`}
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {state?.errors?.lastName && (
                                    <div className="invalid-feedback">
                                        {state?.errors?.lastName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email address*</label>
                            <input
                                type="email"
                                className={`form-control${
                                    state?.errors?.email ? " is-invalid" : ""
                                }`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {state?.errors?.email && (
                                <div className="invalid-feedback">
                                    {state?.errors?.email}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password*</label>
                            <input
                                type="password"
                                className={`form-control${
                                    state?.errors?.password ? " is-invalid" : ""
                                }`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            {state?.errors?.password && (
                                <div className="invalid-feedback">
                                    {state?.errors?.password}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="confirmPassword">
                                Confirm Password*
                            </label>
                            <input
                                type="password"
                                className={`form-control${
                                    state?.errors?.confirmPassword
                                        ? " is-invalid"
                                        : ""
                                }`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            {state?.errors?.confirmPassword && (
                                <div className="invalid-feedback">
                                    {state?.errors?.confirmPassword}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-3 btn btn-primary"
                            disabled={
                                pending ||
                                !formData.firstName ||
                                !formData.lastName ||
                                !formData.email ||
                                !formData.password ||
                                !formData.confirmPassword
                            }
                        >
                            {pending ? "Signing up..." : "Sign up"}
                        </button>

                        {state?.message && (
                            <div
                                className={`mt-3 alert ${
                                    state?.message?.includes("successful")
                                        ? "alert-success"
                                        : "alert-danger"
                                }`}
                            >
                                {state?.message}
                            </div>
                        )}

                        {state?.message?.includes("successful") && (
                            <Link className="btn btn-primary" href="/login">
                                Go to Login
                            </Link>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
