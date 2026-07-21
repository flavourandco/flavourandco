"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { testimonials } from "@/lib/data";
import { Star, Quote } from "lucide-react";

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Infinite smooth marquee animation using GSAP
  useGSAP(
    () => {
      if (!trackRef.current) return;

      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1,
      });
    },
    { scope: sectionRef }
  );

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(0.3); // Smooth slow down on hover
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(1); // Resume normal speed
    }
  };

  // Quadruple array to guarantee infinite seamless scrolling across wide screens
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-base-100 py-20 md:py-28 border-b border-secondary/15 overflow-hidden text-base-content"
    >
      {/* Header Container */}
      <div className="mx-auto max-w-3xl px-6 text-center mb-14">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-secondary">
          Customer Stories & Reviews
        </p>
        <h2 className="mt-3 font-fraunces text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-primary">
          Loved by Foodies & <span className="italic font-medium text-secondary">Gatherers Alike</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm opacity-75 max-w-xl mx-auto leading-relaxed">
          See what pie lovers across Australia are saying about Ash & Simran&apos;s handcrafted fusion pies.
        </p>
      </div>

      {/* Full-Width Infinite Running Testimonial Marquee with Soft Faded Edges */}
      <div
        className="relative w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Soft Faded Left Edge */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-base-100 to-transparent" />
        {/* Soft Faded Right Edge */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-base-100 to-transparent" />

        <div ref={trackRef} className="flex w-max items-stretch gap-6">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.author}-${index}`}
              className="w-[300px] sm:w-[360px] md:w-[420px] shrink-0 rounded-3xl bg-base-200 p-6 sm:p-8 border border-secondary/20 flex flex-col justify-between transition-all duration-300 hover:border-secondary/40"
            >
              <div>
                {/* Header: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-secondary">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-secondary/30 shrink-0" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm leading-relaxed opacity-85 font-normal italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-4 border-t border-secondary/10 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {item.author}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-secondary px-2 py-0.5 rounded-full bg-secondary/15 border border-secondary/20">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeBundleCTA() {
  return null;
}

export { HomeBundleCTA };
