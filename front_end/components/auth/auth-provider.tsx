"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAPI, type AuthProfile, clearTokens } from "@/utils/api";
import { clearAuthTokens } from "@/utils/security";

interface AuthContextType {
  user: AuthProfile | null;
  loading: boolean;
  login: (email: string, password: string, tenantId?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const profile = await AuthAPI.me();
      setUser(profile);
    } catch (error) {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
  };

  const login = async (email: string, password: string, tenantId?: string) => {
    const response = await AuthAPI.login(email, password, tenantId);
    
    // Store tokens in cookies for middleware access
    if (typeof window !== "undefined" && response.access_token) {
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${20160 * 60}; secure; samesite=strict`;
      if (response.refresh_token) {
        document.cookie = `refresh_token=${response.refresh_token}; path=/; max-age=${14 * 24 * 60 * 60}; secure; samesite=strict`;
      }
    }
    
    await refreshUser();
  };

  const logout = () => {
    setUser(null);
    clearTokens();
    clearAuthTokens();
    
    // Clear cookies
    if (typeof window !== "undefined") {
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    
    router.push("/");
  };

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
          setUser(null);
          return;
        }

        const profile = await AuthAPI.me();
        if (mounted) {
          setUser(profile);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
          clearTokens();
          clearAuthTokens();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}