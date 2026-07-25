"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { marqueeItems } from "@/lib/data";

export default function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;

      gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });
    },
    { scope: trackRef }
  );

  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="relative z-[60] overflow-hidden bg-brand-green h-10 flex items-center border-b border-primary/10">
      <div ref={trackRef} className="flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
              {item}
            </span>
            <span className="text-white/60" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
