"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/language-context";

export function ClientProviders({ children }: { children: ReactNode }) {
    return <LanguageProvider>{children}</LanguageProvider>;
}
