"use client";

import { useState } from "react";
import { emailDoesntExist, passwordIncorrect } from "@/utils/errors";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [message, setMessage] = useState(null);
    const router = useRouter();
    const { login, loading, user } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

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

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const { email, password } = formData;
                const data = await login(email, password);
                if (
                    data?.accessToken &&
                    data?.refreshToken &&
                    data?.user?.email == email
                ) {
                    setMessage("Logged in successfully!");
                    // router.push("/");
                }
            } catch (error) {
                // const newErrors = {};
                // switch (error) {
                //     case emailDoesntExist:
                //         newErrors.email = "Email doesn't exist";
                //         break;

                //     case passwordIncorrect:
                //         newErrors.password = "Password is incorrect";
                //         break;

                //     default:
                //         console.log(error);
                // }
                // setErrors(newErrors);
                setMessage("Email or password is incorrect");
            }
        }
    };

    function navigateSignUp() {
        router.push("/signup");
    }

    return (
        <>
            <div className="text-center p-5">
                <div className="container-fluid text-start w-75 border rounded p-4 shadow blur">
                    <div className="d-flex justify-content-between">
                        <h2>Login to CogWorks</h2>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={navigateSignUp}
                        >
                            Sign up
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                aria-describedby="emailHelp"
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-3 btn btn-primary"
                            disabled={
                                !formData.email || !formData.password || loading
                            }
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

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

                    {user && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={(e) => {
                                router.push("/");
                            }}
                        >
                            Go to Home
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
