"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Star, Quote } from "lucide-react";
import type { ReviewItem } from "@/lib/types";
import { subscribeToRealtimeUpdates } from "@/lib/realtime";

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadReviews = useCallback(() => {
    fetch(`/api/reviews?status=approved&t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const featured = json.data.filter((r: ReviewItem) => r.isFeatured);
          setReviews(featured.length > 0 ? featured : json.data);
        } else {
          setReviews([]);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadReviews();

    const unsubscribe = subscribeToRealtimeUpdates((type) => {
      if (type === "reviews") {
        loadReviews();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadReviews]);

  useGSAP(
    () => {
      if (!trackRef.current || reviews.length === 0) return;

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

  if (loading || reviews.length === 0) {
    return null;
  }

  const marqueeItems =
    reviews.length < 4 ? [...reviews, ...reviews, ...reviews, ...reviews] : [...reviews, ...reviews];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-base-100 pt-12 pb-20 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28 border-b border-secondary/15 overflow-hidden text-base-content"
    >
      <div className="mx-auto max-w-3xl px-6 text-center mb-10">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-secondary">
          Customer Stories &amp; Reviews
        </p>
        <h2 className="mt-3 font-fraunces text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-primary">
          Loved by Foodies &amp; <span className="italic font-medium text-secondary">Gatherers Alike</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm opacity-75 max-w-xl mx-auto leading-relaxed">
          See what pie lovers across Australia are saying about Simran&apos;s handcrafted pies and services.
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
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                    {item.name}
                  </span>
                  {item.productName && (
                    <span className="text-[10px] text-secondary font-medium opacity-80 block">
                      {item.productName}
                    </span>
                  )}
                </div>
                {item.isVerified && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-secondary px-2 py-0.5 rounded-full bg-secondary/15 border border-secondary/20 shrink-0">
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBundleCTA() {
  return (
    <section className="w-full bg-[#07402b] text-white py-14 md:py-20 relative overflow-hidden border-b border-[#E3A72B]/30">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E3A72B]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#E3A72B]/15 blur-3xl" />

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center space-y-6">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#E3A72B] block">
          HANDCRAFTED INDO-AUSTRALIAN GOURMET PIES
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Ready to Taste the Difference?
        </h2>
        <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl mx-auto leading-relaxed font-sans">
          Order our signature pie variety packs or cater your next function with Sydney&apos;s finest Indo-Australian handcrafted pies and canapés.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#E3A72B] hover:bg-[#c69c40] text-[#07402b] font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            Order Now &rarr;
          </a>
          <a
            href="/wholesale"
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-sm border border-white/30 transition-all cursor-pointer"
          >
            Wholesale &amp; Catering &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
