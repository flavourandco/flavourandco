"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Star, Quote } from "lucide-react";
import type { ReviewItem } from "@/lib/types";

const FALLBACK_TESTIMONIALS: ReviewItem[] = [
  {
    id: "fb-1",
    name: "Priya Sharma",
    rating: 5,
    date: "Aug 2026",
    comment: "The pastry is flaky and golden, and the filling carries authentic Indian flavours with incredible depth. Our family finished the entire pack in one sitting!",
    isVerified: true,
  },
  {
    id: "fb-2",
    name: "David Miller",
    rating: 5,
    date: "Jul 2026",
    comment: "Served these at our weekend gathering and every single guest asked where I bought them. Heating in the air fryer took just 10 minutes!",
    isVerified: true,
  },
  {
    id: "fb-3",
    name: "Ananya Patel",
    rating: 5,
    date: "Jul 2026",
    comment: "Rich, aromatic spices and premium quality. Truly the best fusion of Australian pie pastry and authentic recipes.",
    isVerified: true,
  },
];

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setReviews(json.data);
        }
      })
      .catch(() => {});
  }, []);

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
    { scope: sectionRef, dependencies: [reviews] }
  );

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(0.3);
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(1);
    }
  };

  const marqueeItems = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-base-100 py-20 md:py-28 border-b border-secondary/15 overflow-hidden text-base-content"
    >
      <div className="mx-auto max-w-3xl px-6 text-center mb-14">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-secondary">
          Customer Stories &amp; Reviews
        </p>
        <h2 className="mt-3 font-fraunces text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-primary">
          Loved by Foodies &amp; <span className="italic font-medium text-secondary">Gatherers Alike</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm opacity-75 max-w-xl mx-auto leading-relaxed">
          See what pie lovers across Australia are saying about Simran&apos;s handcrafted pies.
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-base-100 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-base-100 to-transparent" />

        <div ref={trackRef} className="flex w-max items-stretch gap-6">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[300px] sm:w-[360px] md:w-[420px] shrink-0 rounded-3xl bg-base-200 p-6 sm:p-8 border border-secondary/20 flex flex-col justify-between transition-all duration-300 hover:border-secondary/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-secondary">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-secondary/30 shrink-0" />
                </div>

                <p className="text-xs sm:text-sm leading-relaxed opacity-85 font-normal italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-secondary/10 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {item.name}
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

export function HomeBundleCTA() {
  return null;
}
