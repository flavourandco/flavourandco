"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", { y: 30, opacity: 0, duration: 0.8 })
        .from(
          ".hero-line",
          { y: "110%", duration: 1.1, stagger: 0.12 },
          "-=0.4"
        )
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-cta", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.4");

      if (videoWrapperRef.current) {
        gsap.to(videoWrapperRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-end overflow-hidden pb-16 pt-36 md:items-center md:pb-24 md:pt-40"
    >
      {/* Background Video with Brand Overlay */}
      <div ref={videoWrapperRef} className="absolute inset-0 scale-110">
        <video
          src={media.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        {/* Neutral Dark Gradients to make text legible without a green tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(10,10,10,0.8)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 text-center lg:px-10 z-10">
        <p className="hero-badge mb-6 text-[12px] font-bold uppercase tracking-[0.4em] text-brand-gold">
          Featured on Channel 7's Plate of Origin
        </p>

        <h1 className="mx-auto max-w-5xl font-serif text-[clamp(2.25rem,8vw,5.5rem)] font-normal leading-[0.95] tracking-tight text-cream">
          <span className="reveal-line block">
            <span className="hero-line block">Delivering Great Tasting</span>
          </span>
          <span className="reveal-line block">
            <span className="hero-line block italic text-brand-gold">Indo-Australian</span>
          </span>
          <span className="reveal-line block">
            <span className="hero-line block">Pies Sydney-Wide</span>
          </span>
        </h1>

        <p className="hero-sub mx-auto mt-8 max-w-2xl text-[12px] md:text-[13px] font-medium uppercase leading-relaxed tracking-[0.18em] text-cream/80 px-2">
          Unique fusion pies created by Ash & Simran, combining rich Indian spiced fillings with flaky Aussie pastry.
        </p>

        <div className="hero-cta mt-12 flex items-center justify-center px-6">
          <Link
            href="/shop"
            className="group relative text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold transition-colors duration-300 hover:text-white"
          >
            <span>Explore Menu</span>
            <span className="absolute -bottom-2 left-0 h-[1px] w-full bg-brand-gold transition-all duration-300 group-hover:bg-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
