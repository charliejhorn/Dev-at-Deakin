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

export default function AuthProvider({ children }) {
    // store tokens in localStorage via provided hook
    const [tokens, setTokens] = useLocalStorage("cogworks_tokens", {
        accessToken: null,
        refreshToken: null,
    });
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
                await setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                });
                console.log("tokens after login store them:", tokens);
                setUser(data.user || null);
                return data;
            } finally {
                setLoading(false);
            }
        },
        [setTokens]
    );

    const logout = useCallback(async () => {
        // call backend to revoke refresh token if available
        try {
            if (tokens?.refreshToken) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/logout`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            refreshToken: tokens.refreshToken,
                        }),
                    }
                ).catch(() => {});
            }
        } finally {
            setTokens({ accessToken: null, refreshToken: null });
            setUser(null);
        }
        // }, [tokens, setTokens]);
    }, []);

    const refresh = useCallback(async () => {
        // if no refresh token, return null
        if (!tokens?.refreshToken) return null;

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
                            refreshToken: tokens.refreshToken,
                        }),
                    }
                );
                if (!res.ok) return null;
                const data = await res.json();
                setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                });
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
    }, [tokens, setTokens, user]);

    // const validate = useCallback(async () => {
    //     if (!tokens?.accessToken) return null;

    //     try {
    //         const res = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/validate`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Bearer ${tokens.accessToken}`,
    //                 },
    //             }
    //         );

    //         if (res.ok) {
    //             const data = await res.json();
    //             setUser(data.user || user);
    //             return data.user || true; // return user or true if valid
    //         }

    //         // if access token is invalid, attempt refresh
    //         const refreshed = await refresh();
    //         if (!refreshed) return null;

    //         // retry validation with new token
    //         const retryRes = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/validate`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Bearer ${refreshed.accessToken}`,
    //                 },
    //             }
    //         );

    //         if (retryRes.ok) {
    //             const retryData = await retryRes.json();
    //             setUser(retryData.user || user);
    //             return retryData.user || true;
    //         }

    //         return null;
    //     } catch (err) {
    //         console.error("validation error", err);
    //         return null;
    //     }
    // });

    const value = {
        tokens,
        user,
        login,
        logout,
        refresh,
        loading,
        setTokens,
    };
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
