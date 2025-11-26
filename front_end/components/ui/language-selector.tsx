"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { Language } from "@/lib/translations";

interface LanguageSelectorProps {
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg";
    showLabel?: boolean;
    fullWidth?: boolean;
}

export function LanguageSelector({
    variant = "ghost",
    size = "sm",
    showLabel = false,
    fullWidth = false,
}: LanguageSelectorProps) {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
        { code: 'am' as Language, name: 'አማርኛ', flag: '🇪🇹' },
    ];

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={`gap-2 ${fullWidth ? 'w-full' : ''}`}
                >
                    <Globe className="h-4 w-4" />
                    <span className="text-base">{currentLanguage.flag}</span>
                    {showLabel && <span>{currentLanguage.name}</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`cursor-pointer ${language === lang.code ? 'bg-emerald-50 text-emerald-700' : ''
                            }`}
                    >
                        <span className="text-base mr-2">{lang.flag}</span>
                        <span>{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
