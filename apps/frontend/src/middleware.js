import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "./app/lib/auth";
import { redirect } from "next/dist/server/api-utils";

// these routes will require an authenticated cookie
const protectedRoutes = ["/dashboard"];

export default async function middleware(req) {
    const cookieStore = await cookies();
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);

    // redirect to /login if the user is not authenticated
    if (isProtectedRoute) {
        try {
            validateSession();
        } catch (e) {
            // validate not successful
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    return NextResponse.next();
}

// routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
