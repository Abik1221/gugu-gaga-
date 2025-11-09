"use client";
import { useEffect } from "react";

interface GoogleAdsProps {
  adSlot: string;
  className?: string;
}

export function GoogleAds({ adSlot, className = "" }: GoogleAdsProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "250px", backgroundColor: "#f3f4f6" }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {process.env.NODE_ENV === "development" && (
        <div className="text-gray-500 text-sm p-4">
          Ad Space (will show after AdSense approval)
        </div>
      )}
    </div>
  );
}