"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginAction, logoutAction, refreshAction } from "../lib/actions/auth-actions.js";
import api from "../lib/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await refreshAction();
                if (!isMounted) return;
                const token = data?.accessToken;
                if (token) {
                    setAccessToken(token);
                    api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                if (!isMounted) return;
                setIsAuthenticated(false);
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
        setLoading(true);
        setError(null);
        try {
            const data = await loginAction(username, password);
            const token = data?.accessToken;
            if (token) {
                setAccessToken(token);
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
                setIsAuthenticated(true);
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
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
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
            setLoading(false);
        }
    }, []);

    const value = useMemo(
        () => ({ isAuthenticated, accessToken, loading, error, login, logout }),
        [isAuthenticated, accessToken, loading, error, login, logout]
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
