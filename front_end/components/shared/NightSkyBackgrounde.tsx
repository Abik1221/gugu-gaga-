"use client";

import React, { FC, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

export interface NightSkyProps {
  starCount?: number;
  shootIntervalMs?: number; // ms between shooting stars
  shootingDurationSec?: number; // seconds for a shooting star travel
  maxStarSize?: number; // px
  minStarSize?: number; // px
}

const NightSkyWithGSAP: FC<NightSkyProps> = ({
  starCount = 80,
  shootIntervalMs = 3500,
  shootingDurationSec = 1.2,
  maxStarSize = 3.2,
  minStarSize = 0.8,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shootingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Respect users who prefer reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Precompute star positions & sizes once (keeps markup stable)
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * (maxStarSize - minStarSize) + minStarSize,
      initialOpacity: Math.random() * 0.6 + 0.3,
    }));
  }, [starCount, maxStarSize, minStarSize]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // --- Twinkling stars ---
    const starNodes = Array.from(
      container.querySelectorAll<HTMLElement>(".ns-star")
    );
    const twTweens: gsap.core.Tween[] = [];

    starNodes.forEach((node) => {
      const dur = gsap.utils.random(1, 3);
      const delay = gsap.utils.random(0, 2);
      const tween = gsap.to(node, {
        opacity: gsap.utils.random(0.2, 1),
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay,
      });
      twTweens.push(tween);
    });

    // --- Shooting stars creation ---
    const createShootingStar = () => {
      // On very small screens reduce frequency
      if (window.innerWidth < 420 && Math.random() > 0.6) return;

      const s = document.createElement("div");
      s.className =
        "ns-shooting-star absolute rounded-full pointer-events-none";

      // starting coordinates (allow off-canvas start)
      const startX = gsap.utils.random(-150, window.innerWidth * 0.4);
      const startY = gsap.utils.random(-50, window.innerHeight * 0.45);

      // set initial transform so the element looks like a tail (stretched horizontally)
      gsap.set(s, {
        x: startX,
        y: startY,
        scaleX: gsap.utils.random(8, 14),
        scaleY: gsap.utils.random(0.6, 1),
        opacity: 0,
        rotate: gsap.utils.random(-25, 25),
        transformOrigin: "left center",
      });

      container.appendChild(s);

      const travelX = gsap.utils.random(400, window.innerWidth + 300);
      const travelY = gsap.utils.random(120, window.innerHeight * 0.65);

      const tl = gsap.timeline({
        onComplete: () => {
          s.remove();
          tl.kill();
        },
      });

      tl.to(s, { opacity: 1, duration: 0.06 }).to(
        s,
        {
          x: `+=${travelX}`,
          y: `+=${travelY}`,
          duration: shootingDurationSec,
          ease: "power1.out",
          opacity: 0,
        },
        0
      );

      return s;
    };

    // start interval
    shootingTimerRef.current = setInterval(() => {
      createShootingStar();
    }, shootIntervalMs);

    // cleanup
    return () => {
      twTweens.forEach((t) => t.kill());
      if (shootingTimerRef.current) {
        clearInterval(shootingTimerRef.current);
        shootingTimerRef.current = null;
      }
      // remove any remaining shooting-star nodes
      container
        .querySelectorAll(".ns-shooting-star")
        .forEach((n) => n.remove());
    };
  }, [shootIntervalMs, shootingDurationSec, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden"
      aria-hidden="true"
    >
      {/* Moon (Tailwind for layout; inline styles for soft gradient glow) */}
      <div
        className="absolute right-12 top-12 w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgb(255,250,210), rgba(255,250,210,0.7) 20%, rgba(255,245,200,0.06) 60%, transparent 70%)",
          boxShadow: "0 0 60px 12px rgba(255,245,200,0.03)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.98), rgba(255,245,210,0.8) 40%, transparent 60%)",
            opacity: 0.95,
          }}
        />
      </div>

      {/* Stars (rendered in JSX so Tailwind keeps classes) */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="ns-star absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.initialOpacity,
            transform: "translate3d(-50%,-50%,0)",
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.35))",
          }}
        />
      ))}

      {/* Shooting star styling (Tailwind can't easily set the gradient tail) */}
      <style>{`
        .ns-shooting-star {
          width: 6px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0.2));
          box-shadow: 0 0 10px 3px rgba(255,255,255,0.8);
          border-radius: 999px;
          filter: blur(0.2px);
        }
      `}</style>
    </div>
  );
};

export default NightSkyWithGSAP;
