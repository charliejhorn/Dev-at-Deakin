"use server";

import { redirect } from "next/navigation";
import { loginDAL } from "@/app/lib/dal/auth";
import { cookies } from "next/headers";
import { signUpUser } from "@/app/lib/dal/user";

export async function loginAction(state, queryData) {
    const cookieStore = await cookies();
    const errors = {};

    const email = queryData.email;
    const password = queryData.password;

    console.log("loginAction params:", email, password);

    // check if fields are correct
    const validated = () => {
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid";
        }

        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        return Object.keys(errors).length === 0;
    };

    // if not validated, return the errors
    if (!validated()) {
        return { errors: errors };
    }

    // make request to DAL to get tokens & user object
    // success response is { accessToken, refreshToken, user }
    const data = await loginDAL(email, password);

    // if user doesn't exist,
    if (!data?.user) {
        return { message: "Email or password is incorrect" };
    }

    // store tokens in cookies (server cookieStore supports set)
    try {
        cookieStore.set("accessToken", data.accessToken);
        cookieStore.set("refreshToken", data.refreshToken);
    } catch (e) {
        // cookieStore may be read-only in some contexts; ignore silently
    }

    // TODO set user somewhere here

    // redirect("/");
    return { message: "Log in successful!" };
}

export async function signUpAction(state, formData = {}) {
    const errors = {};

    const firstName =
        typeof formData.firstName === "string" ? formData.firstName.trim() : "";
    const lastName =
        typeof formData.lastName === "string" ? formData.lastName.trim() : "";
    const email =
        typeof formData.email === "string" ? formData.email.trim() : "";
    const password =
        typeof formData.password === "string" ? formData.password : "";
    const confirmPassword =
        typeof formData.confirmPassword === "string"
            ? formData.confirmPassword
            : "";

    if (!firstName) {
        errors.firstName = "First name is required";
    }

    if (!lastName) {
        errors.lastName = "Last name is required";
    }

    if (!email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length) {
        return {
            errors,
            message: null,
            data: null,
        };
    }

    try {
        const data = await signUpUser({
            firstName: firstName || null,
            lastName: lastName || null,
            email,
            password,
        });

        return {
            errors: {},
            message: "Sign up successful!",
            data,
        };
    } catch (err) {
        if (err?.status === 409) {
            const message = `A user with email ${email} already exists`;
            return {
                errors: {
                    email: message,
                },
                message,
                data: null,
            };
        }

        const message =
            err?.info?.message || err?.message || "Error creating user";

        return {
            errors: {
                general: message,
            },
            message,
            data: null,
        };
    }
}
