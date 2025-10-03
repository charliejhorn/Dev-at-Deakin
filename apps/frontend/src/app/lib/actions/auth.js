"use server";

import { redirect } from "next/navigation";
import { loginDAL } from "@/app/lib/dal/auth";
import { cookies } from "next/headers";

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
