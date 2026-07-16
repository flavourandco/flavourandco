"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

// Custom mood cards linked to media.ts assets
const moodCardsWithMedia = [
  {
    title: "Gather & Share",
    description: "Perfect for dinner parties, family tables, and the everyday moments that feel special together.",
    image: media.moods.gather,
  },
  {
    title: "Celebrate & Indulge",
    description: "From holiday feasts to spontaneous weekend plans — pies made to feel lively and unforgettable.",
    image: media.moods.celebrate,
  },
  {
    title: "Unwind & Savour",
    description: "Cozy nights in, after-work comfort, and those quiet moments when you finally get to exhale.",
    image: media.moods.unwind,
  },
  {
    title: "Entertain & Impress",
    description: "Effortless entertaining with flavours that spark conversation and leave guests asking for more.",
    image: media.moods.entertain,
  },
];

export default function HomeMoods() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Only run horizontal pinning on desktop screens (md and above)
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        if (!trackRef.current || !sectionRef.current) return;

        const track = trackRef.current;
        const totalScroll = track.scrollWidth - track.clientWidth;

        // Pin the section and animate track horizontally
        gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${totalScroll}`,
            invalidateOnRefresh: true,
          },
        });

        // Slide up header content
        gsap.from(".mood-header-content > *", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });

        // Add subtle parallax tilt/stagger to cards on enter
        gsap.from(".mood-card", {
          x: 100,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Simple slide-up fade on mobile
        gsap.from(".mood-header-content > *", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-brand-green py-20 md:h-screen md:py-0 border-b border-brand-gold/10"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 md:flex-row md:items-center md:justify-between lg:px-10 z-10">
        
        {/* Sticky Header Panel */}
        <div className="mood-header-content w-full shrink-0 md:w-[28%] text-cream">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold">
            Every Occasion
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.05] tracking-tight text-white">
            Pies Built to
            <br />
            <span className="italic text-brand-gold">Match Moments</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-cream/70">
            From lively Sunday dinners to cozy fireside conversations, our Indo-fusion recipes are blended to turn everyday plates into gatherings worth sharing.
          </p>
          <div className="mt-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold/60 md:flex">
            <span>Scroll to explore</span>
            <div className="h-px w-10 bg-brand-gold/40" />
          </div>
        </div>

        {/* Sliding Cards Track */}
        <div className="mood-track-container w-full overflow-x-auto overflow-y-hidden py-4 md:w-[68%] md:overflow-visible scrollbar-none snap-x snap-mandatory">
          <div
            ref={trackRef}
            className="flex gap-8 w-max snap-align-none"
          >
            {moodCardsWithMedia.map((card) => (
              <article
                key={card.title}
                className="mood-card group relative w-[80vw] shrink-0 overflow-hidden rounded-3xl bg-neutral-900 border border-brand-gold/15 transition-all duration-300 hover:shadow-2xl sm:w-[360px] md:w-[420px] snap-center aspect-[4/5]"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 360px, 420px"
                />
                
                {/* Black gradient overlay starting from bottom upwards */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10">
                  <h3 className="font-serif text-2xl text-brand-gold md:text-3xl font-medium">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-cream/90 md:text-sm">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
