"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

async function createUser(url, { arg: body }) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
    });
    if (!res.ok) {
        const err = new Error("request failed");
        err.status = res.status;
        err.info = await res.json().catch(() => ({}));
        throw err;
    }
    console.log("createUser res:", res);
    return res.json();
}

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    // trigger(payload) performs the mutation
    // isMutating is true while the request is unresolved
    const { trigger, isMutating, error } = useSWRMutation(
        "http://localhost:4000/api/auth/register",
        createUser
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    function navigateLogin() {
        router.push("/login");
    }

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            try {
                // register the user by triggering the mutation
                const data = await trigger(formData);
                // set a simple user-facing message (string) instead of an object
                setMessage("Sign up successful!");
            } catch (error) {
                console.log(error);
                if (error.status === 409) {
                    setMessage(
                        `A user with email ${formData.email} already exists`
                    );
                } else {
                    setMessage(
                        `Error creating user. Response status: ${error.status}`
                    );
                }
            }
        }
    }

    return (
        <>
            <div className="text-center p-5">
                <div className="container-fluid text-start w-75 border rounded p-4 shadow blur">
                    <div className="d-flex justify-content-between">
                        <h2>Sign up for CogWorks</h2>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={navigateLogin}
                        >
                            Login
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mt-3">
                            <label htmlFor="name">Name*</label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.name && (
                                <div className="invalid-feedback">
                                    {errors.name}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email address*</label>
                            <input
                                type="email"
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password*</label>
                            <input
                                type="password"
                                className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.password && (
                                <div className="invalid-feedback">
                                    {errors.password}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="confirmPassword">
                                Confirm Password*
                            </label>
                            <input
                                type="password"
                                className={`form-control ${
                                    errors.confirmPassword ? "is-invalid" : ""
                                }`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-3 btn btn-primary"
                            disabled={
                                !formData.name ||
                                !formData.email ||
                                !formData.password ||
                                !formData.confirmPassword ||
                                isMutating
                            }
                        >
                            {isMutating ? "Signing up…" : "Sign up"}
                        </button>

                        {message && (
                            <div
                                className={`mt-3 alert ${
                                    message.includes("successful")
                                        ? "alert-success"
                                        : "alert-danger"
                                }`}
                            >
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
