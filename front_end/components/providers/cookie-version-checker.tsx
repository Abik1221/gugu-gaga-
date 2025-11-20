"use client";

import { useEffect } from "react";
import { checkAuthVersion } from "@/utils/api";

/**
 * Cookie Version Checker Component
 * Automatically runs on every page load to ensure users have compatible auth data.
 * When app version changes, old auth data is cleared to prevent issues.
 */
export function CookieVersionChecker() {
    useEffect(() => {
        // Check auth version on mount
        checkAuthVersion();
    }, []);

    return null; // This component doesn't render anything
}
