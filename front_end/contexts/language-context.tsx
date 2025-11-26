"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translations } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('mesob_language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am' || savedLanguage === 'or' || savedLanguage === 'ti')) {
            setLanguageState(savedLanguage);
        }
    }, []);

    // Save language preference to localStorage when it  changes
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('mesob_language', lang);
    };

    const value: LanguageContextType = {
        language,
        setLanguage,
        t: translations[language],
    };

    // Always render children, even during SSR
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        // Return default values during SSR or when not wrapped in provider
        return {
            language: 'en' as Language,
            setLanguage: () => { },
            t: translations['en'],
        };
    }
    return context;
}
