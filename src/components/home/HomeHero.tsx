"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { media } from "@/lib/media";

export default function HomeHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(
          [
            ".hero-title-line",
            ".hero-crimp",
            ".hero-subtext",
            ".hero-ingredients",
            ".hero-actions",
            ".hero-divider",
            ".hero-ticket",
          ],
          { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-title-line", { y: 44, opacity: 0, duration: 1, stagger: 0.14 }, 0.25)
        .fromTo(
          ".hero-crimp",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, opacity: 1, duration: 0.9, ease: "power2.inOut" },
          "-=0.5"
        )
        .from(".hero-subtext", { y: 22, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".hero-ingredients", { y: 12, opacity: 0, duration: 0.6 }, "-=0.4")
        .fromTo(
          ".hero-divider",
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, opacity: 1, duration: 0.7 },
          "-=0.6"
        )
        .from(".hero-actions", { x: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
        .from(".hero-ticket", { y: -14, opacity: 0, duration: 0.6 }, "-=0.9");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-end overflow-hidden bg-[#0D0A08] text-[#F2E6D3]"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <video
          ref={videoRef}
          src={media.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1B1410]/90 via-[#1B1410]/55 to-[#1B1410]/35" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0D0A08]/90 via-[#0D0A08]/30 to-transparent" />
        <div className="absolute inset-0 z-10 bg-[#07402B]/10 mix-blend-multiply" />

        <svg className="absolute inset-0 z-10 h-full w-full opacity-[0.06]" aria-hidden="true">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* Rotated ticket tab — now top-right, out of the buttons' way */}
      <div className="hero-ticket pointer-events-none absolute right-6 top-10 z-20 hidden lg:block xl:right-10">
        <div className="flex items-center gap-3 whitespace-nowrap border-y border-[#F2E6D3]/25 px-2 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#E3A72B]">
            Slow-Spiced
          </span>
          <span className="h-1 w-1 rounded-full bg-[#F2E6D3]/40" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#F2E6D3]/70">
            Flaky-Finished
          </span>
        </div>
      </div>

      {/* Main content — left text column / right action column (Shifted downwards) */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 pt-36 pb-12 sm:px-10 sm:pb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:px-16 lg:pb-20 lg:pt-48">
        {/* Left: text stack */}
        <div className="flex max-w-2xl flex-col items-start text-left">
          <h1
            className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#F2E6D3] sm:text-5xl md:text-6xl lg:text-[4.2rem] font-serif"
          >
            <span className="hero-title-line block">
              Handcrafted{" "}
              <span className="italic font-medium text-[#E3A72B]">Indo-Australian</span>
            </span>
            <span className="hero-title-line mt-1 block font-bold">
              Gourmet Fusion Pies
            </span>
          </h1>

          <svg
            className="hero-crimp mt-6 h-4 w-full max-w-md opacity-0"
            viewBox="0 0 400 16"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,8 Q10,0 20,8 T40,8 T60,8 T80,8 T100,8 T120,8 T140,8 T160,8 T180,8 T200,8 T220,8 T240,8 T260,8 T280,8 T300,8 T320,8 T340,8 T360,8 T380,8 T400,8"
              fill="none"
              stroke="#6b1e30"
              strokeWidth="2"
            />
          </svg>

          <p className="hero-subtext mt-6 max-w-xl text-sm font-normal leading-relaxed text-[#F2E6D3]/85 sm:text-base">
            Baking our roots into every pie. Rich, slow-cooked Indian spiced fillings, wrapped
            in light, multi-layered flaky Aussie pastry — made by hand, one crimp at a time.
          </p>

          <div className="hero-ingredients mt-6 flex flex-wrap items-center gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em]">
            <span className="text-[#c69c40] font-bold">Cardamom</span>
            <span className="mx-3 h-1.5 w-1.5 rounded-full bg-[#6b1e30] shrink-0" />
            <span className="text-[#c69c40] font-bold">Ghee</span>
            <span className="mx-3 h-1.5 w-1.5 rounded-full bg-[#6b1e30] shrink-0" />
            <span className="text-[#c69c40] font-bold">Golden Pastry</span>
            <span className="mx-3 h-1.5 w-1.5 rounded-full bg-[#6b1e30] shrink-0" />
            <span className="text-[#c69c40] font-bold">Slow-Roasted Spice</span>
          </div>
        </div>

        {/* Crimp-line divider between columns, desktop only */}
        <div
          className="hero-divider hidden self-stretch w-px bg-gradient-to-b from-transparent via-[#F2E6D3]/25 to-transparent opacity-0 lg:block"
          aria-hidden="true"
        />

        {/* Right: action panel */}
        <div className="hero-actions flex w-full flex-row items-center gap-4 sm:gap-5 lg:w-auto">
          <Link
            href="/shop"
            className="group inline-flex flex-1 lg:flex-initial items-center justify-center gap-2.5 bg-brand-garnet px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F2E6D3] transition-colors hover:bg-brand-gold hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A72B] sm:text-sm lg:w-56 shadow-sm whitespace-nowrap"
          >
            <span>Explore Menu</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/our-story"
            className="group inline-flex flex-1 lg:flex-initial items-center justify-center gap-2.5 border border-[#F2E6D3]/30 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F2E6D3]/90 transition-colors hover:border-[#F2E6D3] hover:bg-[#F2E6D3]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A72B] sm:text-sm lg:w-56 shadow-sm whitespace-nowrap"
          >
            <span>Our Story</span>
          </Link>
        </div>
      </div>
    </section>
  );
}