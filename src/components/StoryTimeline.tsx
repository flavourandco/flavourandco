"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import media from "@/lib/media";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Hand-drawn wave divider for header */
function SquiggleDivider({ className = "" }: { className?: string }) {
  const amplitude = 6;
  const period = 20;
  const width = 200;
  let d = `M0 10`;
  for (let x = 0; x < width; x += period) {
    d += ` Q ${x + period / 4} ${10 - amplitude}, ${x + period / 2} 10 Q ${x + (3 * period) / 4} ${10 + amplitude}, ${x + period} 10`;
  }
  return (
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" className={`block w-full ${className}`} aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Highlighter tag badge */
function HighlightTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-sm bg-[#c69c40] text-[#07402b] font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase">
      {children}
    </span>
  );
}

interface MilestoneItem {
  num: string;
  year: string;
  title: string;
  tag?: string;
  copy: string;
  image: string;
  isTopImage: boolean;
  color: string;
  imagePosition?: string;
}

export default function StoryTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const milestones: MilestoneItem[] = [
    {
      num: "01",
      year: "2018",
      title: "The Spark",
      tag: "Heritage Kitchen",
      copy: "Simran starts combining her heritage recipes with classic buttery pastry, right in her home kitchen.",
      image: media.timeline.y2018,
      isTopImage: true,
      color: "bg-[#6b1e30]",
      imagePosition: "object-top",
    },
    {
      num: "02",
      year: "2020",
      title: "Plate of Origin",
      tag: "Channel 7 TV",
      copy: "Represents India on Channel 7's national cooking show, winning judges over with bold, familial flavours.",
      image: media.timeline.y2020,
      isTopImage: false,
      color: "bg-[#c69c40]",
      imagePosition: "object-center",
    },
    {
      num: "03",
      year: "2021",
      title: "Going Live",
      tag: "E-Commerce Launch",
      copy: "Our website launches, bringing handcrafted gourmet pies direct to foodies across Sydney.",
      image: media.timeline.y2021,
      isTopImage: true,
      color: "bg-[#6b1e30]",
      imagePosition: "object-center",
    },
    {
      num: "04",
      year: "2022",
      title: "Into Commercial Kitchen",
      tag: "Scaling Up",
      copy: "We step out of the home kitchen and into a licensed commercial kitchen — scaling up to meet growing demand.",
      image: media.timeline.y2022,
      isTopImage: false,
      color: "bg-[#c69c40]",
      imagePosition: "object-center",
    },
    {
      num: "05",
      year: "2024",
      title: "Our Own Facility",
      tag: "HACCP Certified",
      copy: "We move into our own dedicated, HACCP-certified facility — and land our first major wholesale partner.",
      image: media.timeline.y2024,
      isTopImage: true,
      color: "bg-[#6b1e30]",
      imagePosition: "object-center",
    },
    {
      num: "06",
      year: "2025",
      title: "Built for Business",
      tag: "Wholesale Expansion",
      copy: "Wholesale becomes a core focus, growing into a trusted supplier for hotels, catering, and cafes.",
      image: media.timeline.y2025,
      isTopImage: false,
      color: "bg-[#c69c40]",
      imagePosition: "object-center",
    },
    {
      num: "07",
      year: "2026",
      title: "Flavour & Co.",
      tag: "The Next Chapter",
      copy: "We rebrand to Flavour & Co, expanding into South Asian canapés and breakfast items at scale.",
      image: media.timeline.y2026,
      isTopImage: true,
      color: "bg-[#6b1e30]",
      imagePosition: "object-center",
    },
  ];

  useGSAP(
    () => {
      const section = containerRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const getMaxScroll = () => {
        const parentWidth = track.parentElement?.clientWidth || window.innerWidth;
        const maxScroll = track.scrollWidth - parentWidth;
        return maxScroll > 0 ? maxScroll : 0;
      };

      // Guaranteed full scroll from start (01) to end (07) on down-scroll, and back to start on up-scroll across all screens
      const tween = gsap.to(track, {
        x: () => -getMaxScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const index = Math.min(
              Math.floor(self.progress * milestones.length),
              milestones.length - 1
            );
            setActiveIndex(Math.max(0, index));
          },
        },
      });

      return () => {
        tween.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-[#f8f3eb] text-stone-800 border-t border-b border-secondary/15 h-[220vh] md:h-[260vh]"
    >
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-4 sm:py-6 md:py-8 overflow-hidden bg-[#f8f3eb]">
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#6b1e30]/15 z-30">
          <div
            className="h-full bg-gradient-to-r from-[#6b1e30] via-[#c69c40] to-[#07402b] transition-all duration-75 origin-left"
            style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
          />
        </div>

        {/* Section Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 z-20">
          <div className="text-left">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#6b1e30]">
              Our History &amp; Growth
            </span>
            <h3 className="mt-0.5 font-serif text-2xl sm:text-4xl lg:text-5xl text-brand-green font-semibold leading-tight">
              Our Journey &amp; <span className="text-[#6b1e30] italic font-medium">Milestones</span>
            </h3>
            <div className="text-[#6b1e30] mt-1.5 w-20 sm:w-24 opacity-70">
              <SquiggleDivider />
            </div>
          </div>
        </div>

        {/* HORIZONTAL TIMELINE TRACK FOR ALL SCREEN SIZES (MOBILE & DESKTOP) */}
        <div className="w-full overflow-hidden my-auto py-1 sm:py-2 z-10 relative">
          <div
            ref={trackRef}
            className="relative flex items-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-8 md:px-16 w-max min-h-[460px] sm:min-h-[520px] md:min-h-[560px] will-change-transform"
          >
            {/* Single Continuous Horizontal Center Axis Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2.5px] bg-[#6b1e30]/30 -translate-y-1/2 z-0 pointer-events-none" />

            {milestones.map((item) => (
              <div
                key={item.year}
                className="relative w-[250px] sm:w-[290px] md:w-[320px] lg:w-[340px] xl:w-[360px] shrink-0 h-[460px] sm:h-[520px] md:h-[560px] flex flex-col justify-between items-center text-center px-1 z-10"
              >
                {/* Continuous Vertical Dashed Connector Line */}
                <div className="absolute top-10 sm:top-14 bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 w-[2px] border-l-2 border-dashed border-[#6b1e30]/40 z-0 pointer-events-none" />

                {/* Center Node Dot strictly on cross-section */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${item.isTopImage ? "bg-[#6b1e30]" : "bg-[#c69c40]"} border-3 sm:border-4 border-[#f8f3eb] shadow-md flex items-center justify-center transition-transform hover:scale-125`}
                  >
                    <div
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${item.isTopImage ? "bg-brand-gold" : "bg-[#07402b]"}`}
                    />
                  </div>
                </div>

                {/* TOP HALF (Image if top, Text if bottom) */}
                <div className="relative z-10 h-[210px] sm:h-[240px] lg:h-[265px] flex flex-col justify-end items-center">
                  {item.isTopImage ? (
                    <div className="relative group mb-1 sm:mb-2">
                      <div className={`absolute -top-1.5 -right-1.5 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full ${item.color} shadow-sm transition-transform duration-500 group-hover:scale-105`} />
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-xl z-10">
                        <Image
                          src={item.image}
                          alt={`${item.year} - ${item.title}`}
                          fill
                          className={`object-cover ${item.imagePosition || "object-center"} group-hover:scale-110 transition-transform duration-700`}
                          sizes="(max-width: 640px) 130px, 200px"
                          quality={92}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[240px] sm:max-w-[280px] lg:max-w-[310px] pb-2 sm:pb-3 px-1">
                      <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#6b1e30] tracking-tight leading-none mb-1">
                        {item.year}
                      </span>
                      <h4 className="font-bold text-brand-green text-[11px] sm:text-xs lg:text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5 justify-center">
                        {item.title}
                      </h4>
                      {item.tag && (
                        <div className="mb-1 sm:mb-1.5">
                          <HighlightTag>{item.tag}</HighlightTag>
                        </div>
                      )}
                      <p className="text-[11px] sm:text-xs lg:text-sm text-stone-600 leading-relaxed font-sans font-normal">
                        {item.copy}
                      </p>
                    </div>
                  )}
                </div>

                {/* BOTTOM HALF (Text if top, Image if bottom) */}
                <div className="relative z-10 h-[210px] sm:h-[240px] lg:h-[265px] flex flex-col justify-start items-center">
                  {!item.isTopImage ? (
                    <div className="relative group pt-1 sm:pt-2">
                      <div className={`absolute -bottom-1.5 -left-1.5 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full ${item.color} shadow-sm transition-transform duration-500 group-hover:scale-105`} />
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-xl z-10">
                        <Image
                          src={item.image}
                          alt={`${item.year} - ${item.title}`}
                          fill
                          className={`object-cover ${item.imagePosition || "object-center"} group-hover:scale-110 transition-transform duration-700`}
                          sizes="(max-width: 640px) 130px, 200px"
                          quality={92}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[240px] sm:max-w-[280px] lg:max-w-[310px] pt-2 sm:pt-3 px-1">
                      <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#6b1e30] tracking-tight leading-none mb-1">
                        {item.year}
                      </span>
                      <h4 className="font-bold text-brand-green text-[11px] sm:text-xs lg:text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5 justify-center">
                        {item.title}
                      </h4>
                      {item.tag && (
                        <div className="mb-1 sm:mb-1.5">
                          <HighlightTag>{item.tag}</HighlightTag>
                        </div>
                      )}
                      <p className="text-[11px] sm:text-xs lg:text-sm text-stone-600 leading-relaxed font-sans font-normal">
                        {item.copy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info line */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full flex flex-wrap items-center justify-between gap-2 z-20 text-[10px] sm:text-[11px] font-mono text-stone-800 font-bold border-t border-stone-300/80 pt-2.5">
          <span className="text-stone-900 font-extrabold uppercase tracking-wider">FLAVOUR &amp; CO. ARCHIVE</span>

          {/* Active Milestone Counter */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-stone-800">
            <span className="text-[#6b1e30] font-serif text-sm sm:text-base font-bold">
              {milestones[activeIndex]?.year}
            </span>
            <span className="text-stone-400">/</span>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} OF {String(milestones.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1 pl-2 sm:pl-3 border-l border-stone-400 text-stone-800 text-[10px] sm:text-[11px] tracking-wider uppercase font-sans font-bold">
              <span>Scroll down</span>
              <span className="animate-bounce text-[#6b1e30]">↓</span>
            </div>
          </div>

          <span className="text-stone-900 font-extrabold tracking-wider">2018 — 2026</span>
        </div>
      </div>
    </section>
  );
}