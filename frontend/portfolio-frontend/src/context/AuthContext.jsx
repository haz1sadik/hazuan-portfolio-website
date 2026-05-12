"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loginAction, logoutAction, refreshAction } from "../lib/actions/auth-actions.js";
import api from "../lib/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticating, setAuthenticating] = useState(false);
    const [error, setError] = useState(null);
    const hasActiveSessionRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const storedToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (storedToken) {
            setAccessToken(storedToken);
            api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
            setIsAuthenticated(true);
        }

        const restoreSession = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await Promise.race([
                    refreshAction(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Refresh timeout")), 8000)
                    ),
                ]);
                if (!isMounted || hasActiveSessionRef.current) return;
                const token = data?.accessToken;
                if (token) {
                    setAccessToken(token);
                    api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    if (typeof window !== "undefined") {
                        localStorage.setItem("accessToken", token);
                    }
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                if (!isMounted || hasActiveSessionRef.current) return;
                if (!storedToken) {
                    setIsAuthenticated(false);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = useCallback(async (username, password) => {
        setAuthenticating(true);
        setError(null);
        try {
            const data = await loginAction(username, password);
            const token = data?.accessToken;
            if (token) {
                setAccessToken(token);
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
                if (typeof window !== "undefined") {
                    localStorage.setItem("accessToken", token);
                }
                setIsAuthenticated(true);
                hasActiveSessionRef.current = true;
                return true;
            }
            setIsAuthenticated(false);
            return true;
        } catch (err) {
            const message =
                err?.response?.data?.message || err?.message || "Login failed";
            setError(message);
            setIsAuthenticated(false);
            return false;
        } finally {
            setAuthenticating(false);
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setAuthenticating(true);
        setError(null);
        try {
            const res = await logoutAction();
            console.log(res);

            return true;
        } catch (err) {
            const message =
                err?.response?.data?.message || err?.message || "Logout failed";
            setError(message);
            return false;
        } finally {
            setIsAuthenticated(false);
            setAccessToken(null);
            delete api.defaults.headers.common.Authorization;
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
            }
            setAuthenticating(false);
        }
    }, []);

    const value = useMemo(
        () => ({
            isAuthenticated,
            accessToken,
            loading,
            authenticating,
            error,
            login,
            logout,
        }),
        [isAuthenticated, accessToken, loading, authenticating, error, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
