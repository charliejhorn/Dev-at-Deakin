import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutDAL, validateSession } from "./app/lib/dal/auth";
import { redirect } from "next/dist/server/api-utils";

// these routes will require an authenticated cookie
const protectedRoutes = ["/account"];

// routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);

    console.log("path: " + path + " | isProtectedRoute: " + isProtectedRoute);

    // redirect to /login if the user is not authenticated
    if (isProtectedRoute) {
        try {
            console.log("[middleware] attempting validateSession()");
            validateSession();
        } catch (e) {
            // validate not successful
            console.log("[middleware] validation unsuccessful");
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    if (path === "/logout") {
        console.log("[middleware] logout requested");
        await logoutDAL();
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}
