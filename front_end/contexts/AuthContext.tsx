"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthAPI, AuthProfile } from "@/utils/api";

interface AuthContextValue {
    user: AuthProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const profile = await AuthAPI.me();
            setUser(profile);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
