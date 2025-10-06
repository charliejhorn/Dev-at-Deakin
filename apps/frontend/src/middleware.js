import { NextResponse } from "next/server";
import { validateSession } from "./app/lib/dal/auth";
import { logoutAction } from "./app/lib/actions/logout";
import { getSubscription } from "./app/lib/dal/subscriptions";

// these routes will require an authenticated cookie
const protectedRoutes = ["/account", "/checkout", "/posts/create"];

// routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);

    // console.log("path: " + path + " | isProtectedRoute: " + isProtectedRoute);

    // redirect to /login if the user is not authenticated
    if (isProtectedRoute) {
        try {
            console.log("[middleware] attempting validateSession()");
            const sessionUser = await validateSession();
            if (!sessionUser) {
                console.log("[middleware] no active session");
                return NextResponse.redirect(new URL("/login", req.nextUrl));
            }
            if (path === "/checkout" && sessionUser?.email) {
                const subscription = await getSubscription(sessionUser.email, {
                    cookieStore: req.cookies,
                });
                if (subscription?.status === "active") {
                    return NextResponse.redirect(
                        new URL("/account", req.nextUrl)
                    );
                }
            }
        } catch (e) {
            // validate not successful
            console.log("[middleware] validation unsuccessful");
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    if (path === "/logout") {
        console.log("[middleware] logout requested");
        const response = NextResponse.redirect(new URL("/", req.nextUrl));

        await logoutAction({
            requestCookies: req.cookies,
            responseCookies: response.cookies,
        });

        response.headers.set("Cache-Control", "no-store");

        return response;
    }

    return NextResponse.next();
}
