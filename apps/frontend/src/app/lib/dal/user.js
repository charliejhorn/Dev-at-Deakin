import { validateSession } from "./auth";
import { cache } from "react";

// cached version
// export const getUser = cache(async () => {
//     try {
//         const user = await validateSession();
//         if (!user) return null;
//         return user;
//     } catch (e) {
//         console.log("getUser error:", e);
//     }
// });

// un-cached version
export async function getUser() {
    try {
        const user = await validateSession();
        if (!user) return null;
        return user;
    } catch (e) {
        console.log("getUser error:", e);
        // return null on failures so callers (eg. NavBar) treat as logged out
        return null;
    }
}

export const signUpUser = cache(async (user) => {
    // use SWR to make POST request to /api/users
});
