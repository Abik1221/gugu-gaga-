"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/contexts/language-context";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 animate-pulse border-t border-emerald-300 shadow-2xl shadow-emerald-500/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">{t.cookieConsent.title}</p>
            <p>
              {t.cookieConsent.description}{" "}
              <Link
                href="/privacy"
                className="text-emerald-600 hover:underline"
              >
                {t.cookieConsent.learnMore}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="flex-1 sm:flex-none"
          >
            {t.cookieConsent.decline}
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none"
          >
            {t.cookieConsent.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
