"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/lib/data";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-scroll every 2.5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered]);

  useGSAP(
    () => {
      gsap.from(".review-header > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".review-header",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".review-carousel-container", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".review-carousel-container",
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <section ref={sectionRef} className="bg-cream py-24 md:py-32 border-b border-brand-gold/10 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="review-header mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold">
            Testimonials
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-tight text-brand-green">
            Loved by Foodies &
            <br />
            <span className="italic text-brand-gold">Gatherers Alike</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="review-carousel-container relative mt-16 mx-auto max-w-4xl px-0 sm:px-12">
          {/* Slider Viewport */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((item) => (
                <div key={item.author} className="w-full shrink-0 px-4">
                  <blockquote className="review-card mx-auto max-w-2xl text-center rounded-3xl bg-white p-8 md:p-12 shadow-xl border border-brand-gold/10 transition-shadow duration-300 hover:shadow-2xl">
                    <div className="mb-6 flex justify-center gap-1 text-brand-gold">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-4.5 w-4.5 fill-current" />
                      ))}
                    </div>
                    <p className="font-serif text-lg md:text-xl leading-relaxed text-charcoal/80 italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <footer className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green">
                      — {item.author}
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* Chevron Navigation Buttons */}
          <button
            type="button"
            onClick={prevSlide}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-brand-green text-brand-gold border border-brand-gold/20 shadow-lg transition-all hover:bg-brand-gold hover:text-brand-green hover:scale-105 sm:left-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-brand-green text-brand-gold border border-brand-gold/20 shadow-lg transition-all hover:bg-brand-gold hover:text-brand-green hover:scale-105 sm:right-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators / Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-6 bg-brand-gold" : "w-1.5 bg-brand-green/20"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeBundleCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".bundle-content > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-green py-12 text-cream md:py-16"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-gold blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="bundle-content relative mx-auto max-w-3xl px-6 text-center lg:px-10 z-10">
        <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold">
          Bundle & Save
        </p>
        <h2 className="mt-2 font-serif text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.1] tracking-tight text-white">
          Order More. Save More.
          <br />
          <span className="italic text-brand-gold">Enjoy More Together.</span>
        </h2>
        <p className="mt-3 text-xs md:text-sm leading-relaxed text-cream/80 max-w-xl mx-auto">
          Curate your perfect table package, mix & match different pies, and receive extra value on every gathering.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 w-full max-w-[540px] sm:max-w-none mx-auto">
          {[
            { spend: "$50", save: "Save $5" },
            { spend: "$75", save: "Free Shipping" },
            { spend: "$100", save: "$10 + Free Shipping" },
          ].map((tier) => (
            <div
              key={tier.spend}
              className="flex flex-col justify-center items-center text-center rounded-xl sm:rounded-2xl border border-brand-gold/20 bg-brand-green/50 px-2 py-2.5 sm:px-8 sm:py-5 backdrop-blur-sm shadow-md h-full min-h-[70px] sm:min-h-0"
            >
              <p className="text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-brand-gold">
                Spend {tier.spend}
              </p>
              <p className="mt-0.5 font-serif text-[9px] min-[350px]:text-xs min-[400px]:text-sm sm:text-xl text-white font-medium leading-tight">
                {tier.save}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-md bg-brand-gold text-brand-green hover:bg-cream hover:scale-105 px-6 py-2.5 text-[10px] sm:px-10 sm:py-3.5 sm:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-xl"
        >
          Shop Bundles
        </Link>
      </div>
    </section>
  );
}

export { HomeBundleCTA };
