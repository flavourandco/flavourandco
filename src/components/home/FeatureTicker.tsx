"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { tickerItems } from "@/lib/data";

export default function FeatureTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;

      gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });

      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
        },
      });
    },
    { scope: sectionRef }
  );

  const items = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-y border-brand-gold/15 bg-brand-green py-5"
    >
      <div ref={trackRef} className="flex w-max items-center gap-12">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-12 text-[12px] font-semibold uppercase tracking-[0.25em] text-cream/90"
          >
            {item}
            <span className="h-2 w-2 rotate-45 bg-brand-gold" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
