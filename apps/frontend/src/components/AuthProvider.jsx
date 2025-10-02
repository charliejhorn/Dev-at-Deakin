"use client";
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

// no swr usage here; keep provider lean

const AuthCtx = createContext(null);
export function useAuth() {
    return useContext(AuthCtx);
}

export default async function AuthProvider({ children }) {
    // store tokens in localStorage via provided hook
    // const [tokens, setTokens] = useLocalStorage("cogworks_tokens", {
    //     accessToken: null,
    //     refreshToken: null,
    // });
    const cookieStore = await cookies();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // coalesce concurrent refresh attempts
    const refreshInflight = useRef(null);

    const login = useCallback(
        async (email, password) => {
            console.log("logging in " + email);
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    }
                );
                if (!res.ok) {
                    const info = await res.json().catch(() => ({}));
                    throw new Error(info?.message || "login failed");
                }

                // login successful
                const data = await res.json();
                console.log("login data", data);
                // await setTokens({
                //     accessToken: data.accessToken,
                //     refreshToken: data.refreshToken,
                // });
                cookieStore.set("accessToken", data.accessToken);
                cookieStore.set("refreshToken", data.refreshToken);
                console.log(
                    "tokens after login stores them:",
                    cookieStore.get("accessToken") +
                        ":" +
                        cookieStore.get("refreshToken")
                );
                setUser(data.user || null);
                return data;
            } finally {
                setLoading(false);
            }
        },
        [cookieStore, setUser]
    );

    const logout = useCallback(async () => {
        // call backend to revoke refresh token if available
        try {
            if (cookieStore.has("refreshToken")) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/logout`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            refreshToken: cookieStore.get("refreshToken"),
                        }),
                    }
                ).catch(() => {});
            }
        } finally {
            // setTokens({ accessToken: null, refreshToken: null });
            cookieStore.set("accessToken", null);
            cookieStore.set("refreshToken", null);
            setUser(null);
        }
        // }, [tokens, setTokens]);
    }, []);

    const refresh = useCallback(async () => {
        // if no refresh token, return null
        // if (!tokens?.refreshToken) return null;
        if (cookieStore.has(refreshToken)) return null;

        // single-flight refresh
        if (refreshInflight.current) {
            return refreshInflight.current;
        }

        refreshInflight.current = (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/refresh`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            refreshToken: cookieStore.get("refreshToken"),
                        }),
                    }
                );
                if (!res.ok) return null;
                const data = await res.json();
                // setTokens({
                //     accessToken: data.accessToken,
                //     refreshToken: data.refreshToken,
                // });
                cookieStore.set("accessToken", data.accessToken);
                cookieStore.set("refreshToken", data.refreshToken);
                setUser(data.user || user);
                return data;
            } catch (err) {
                return null;
            } finally {
                // release the single-flight promise
                refreshInflight.current = null;
            }
        })();

        return refreshInflight.current;
    }, [cookieStore, user]);

    const value = {
        user,
        login,
        logout,
        refresh,
        loading,
    };
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
