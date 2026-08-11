"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const PARTNER_LOGOS = [
  { name: "The Fullerton Hotel Sydney", src: "/partners/fullerton-hotel.svg" },
  { name: "Hyatt Regency Sydney", src: "/partners/hyatt-regency.svg" },
  { name: "Sheraton Grand Sydney Hyde Park", src: "/partners/sheraton-grand.svg" },
  { name: "Amora Hotel Jamison Sydney", src: "/partners/amora-hotel.svg" },
  { name: "Novotel Sydney Darling Harbour", src: "/partners/novotel.svg" },
  { name: "PARKROYAL Parramatta", src: "/partners/parkroyal.svg" },
  { name: "Channel 7 Plate of Origin", src: "/partners/channel-7.svg" },
  { name: "Corporate Catering Partners", src: "/partners/corporate-catering.svg" },
];

interface PartnerLogosStripProps {
  title?: string;
  speed?: number; // duration in seconds
  className?: string;
}

export default function PartnerLogosStrip({
  title = "PARTNERED HOTELS & BRANDS",
  speed = 35,
  className = "",
}: PartnerLogosStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;

      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    },
    { scope: containerRef, dependencies: [speed] }
  );

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.25, duration: 0.5, ease: "power1.out" });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5, ease: "power1.out" });
    }
  };

  const marqueeItems = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section ref={containerRef} className={`w-full bg-[#f7efe6] py-8 border-y border-[#ebe3d8] overflow-hidden ${className}`}>
      {title && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30]">
            {title}
          </span>
        </div>
      )}

      {/* Infinite Marquee Strip */}
      <div
        className="relative w-full overflow-hidden py-2 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient Fade Edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-[#f7efe6] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-[#f7efe6] to-transparent" />

        {/* Moving Track */}
        <div ref={trackRef} className="flex items-center gap-12 sm:gap-16 w-max">
          {marqueeItems.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="relative h-12 w-44 sm:w-48 shrink-0 opacity-85 hover:opacity-100 transition-opacity"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
