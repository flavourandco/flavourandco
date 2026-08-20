"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import media from "@/lib/media";

/** Scalloped "seal" path — a fluted circle echoing a crimped pie edge.
 *  Computed once at module load since the shape is identical for every year. */
const SEAL_PATH = (() => {
  const cx = 50, cy = 50, rOuter = 40, flutes = 16, depth = 3.5;
  const pts: [number, number][] = [];
  for (let i = 0; i <= flutes; i++) {
    const a = (i / flutes) * Math.PI * 2;
    const r = rOuter + (i % 2 === 0 ? depth : -depth);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
  for (let i = 1; i < pts.length; i++) {
    const midA = ((i - 0.5) / flutes) * Math.PI * 2;
    const mx = cx + rOuter * Math.cos(midA);
    const my = cy + rOuter * Math.sin(midA);
    d += `Q ${mx.toFixed(2)} ${my.toFixed(2)}, ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} `;
  }
  return d + "Z";
})();

export interface YearSealProps {
  year: string;
  filled: boolean;
}

function YearSeal({ year, filled }: YearSealProps): React.ReactElement {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <path
        d={SEAL_PATH}
        fill={filled ? "#6b1e30" : "#fdf8f3"}
        stroke={filled ? "#c69c40" : "#6b1e30"}
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={filled ? "#f5e9ce" : "#6b1e30"}
        strokeWidth="1"
        strokeDasharray="1.5 3"
        opacity="0.55"
      />
      <text
        x="50"
        y="59"
        textAnchor="middle"
        fontSize="29"
        fontFamily="var(--font-serif, serif)"
        fontWeight={800}
        fill={filled ? "#fdf8f3" : "#6b1e30"}
      >
        {year}
      </text>
    </svg>
  );
}

function OrnamentDivider(): React.ReactElement {
  return (
    <div className="flex items-center justify-center gap-3 w-full" aria-hidden="true">
      <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c69c40]" />
      <span className="w-2 h-2 rotate-45 bg-[#c69c40]" />
      <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c69c40]" />
    </div>
  );
}

export interface MilestoneItem {
  year: string;
  title: string;
  tag: string;
  copy: string;
  image: string;
  imagePosition?: string;
  bgClass?: string;
  imageFit?: "object-cover" | "object-contain";
}

export interface ImageFrameProps {
  item: MilestoneItem;
  flip: boolean;
  aspectClass: string;
  frameClass: string;
  roundClass: string;
  sizes: string;
}

/** Gold-framed image with alternating "crimped" corner rounding. */
function ImageFrame({
  item,
  flip,
  aspectClass,
  frameClass,
  roundClass,
  sizes,
}: ImageFrameProps): React.ReactElement {
  const rounding = flip
    ? `rounded-tr-[8px] rounded-bl-[8px] ${roundClass.replace("TL", "TR").replace("BR", "BL")}`
    : roundClass;
  const isContain = item.imageFit === "object-contain";
  return (
    <div className={`w-full p-[3px] bg-gradient-to-br from-[#c69c40] via-[#e8cd8a] to-[#c69c40]/60 shadow-sm ${frameClass}`}>
      <div className={`relative w-full ${aspectClass} overflow-hidden ${rounding} group ${item.bgClass || ""}`}>
        <Image
          src={item.image}
          alt={`${item.year} — ${item.title}`}
          fill
          className={`${isContain ? "object-contain p-4 sm:p-5" : "object-cover"} transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.05] ${item.imagePosition || "object-center"}`}
          sizes={sizes}
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07402b]/25 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export interface StoryContentProps {
  item: MilestoneItem;
  ghostClass: string;
  titleClass: string;
  bodyClass: string;
  tagClass: string;
  maxWidthClass?: string;
}

/** Story copy with a ghost year-numeral behind the title. */
function StoryContent({
  item,
  ghostClass,
  titleClass,
  bodyClass,
  tagClass,
  maxWidthClass = "max-w-[38ch]",
}: StoryContentProps): React.ReactElement {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6b1e30] shrink-0" />
        <span className={`font-mono uppercase text-[#6b1e30]/85 font-semibold ${tagClass}`}>
          {item.tag}
        </span>
      </div>
      <div className="relative w-full flex flex-col items-center justify-center">
        <span aria-hidden="true" className={`absolute select-none leading-none z-0 font-serif font-black text-[#6b1e30]/[0.07] ${ghostClass}`}>
          {item.year.slice(2)}
        </span>
        <h4 className={`relative z-10 font-serif text-[#07402b] font-semibold leading-snug ${titleClass}`}>
          {item.title}
        </h4>
      </div>
      <p className={`relative z-10 text-stone-600 font-sans leading-relaxed mt-1.5 mx-auto ${maxWidthClass} ${bodyClass}`}>
        {item.copy}
      </p>
      <span className="mt-2.5 h-px w-8 bg-[#c69c40]/70 mx-auto" />
    </div>
  );
}

export interface UseRowRevealResult {
  nodeRefs: React.RefObject<(HTMLDivElement | null)[]>;
  visible: Set<number>;
}

/** Reveals rows/columns as they scroll into view. */
function useRowReveal(count: number): UseRowRevealResult {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<Set<number>>(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return new Set(Array.from({ length: count }, (_, i) => i));
    }
    return new Set();
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(new Set(Array.from({ length: count }, (_, i) => i)));
      return;
    }
    const observers: IntersectionObserver[] = [];
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set(prev).add(i));
            io.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [count]);

  return { nodeRefs, visible };
}

export default function StoryTimeline(): React.ReactElement {
  const milestones: MilestoneItem[] = [
    {
      year: "2018",
      title: "The Spark",
      tag: "Heritage kitchen",
      copy: "Simran starts combining her heritage recipes with classic buttery pastry, right in her home kitchen.",
      image: media.timeline.y2018,
      imagePosition: "object-top",
    },
    {
      year: "2020",
      title: "Plate of Origin",
      tag: "Channel 7 TV",
      copy: "Represents India on Channel 7's national cooking show, winning judges over with bold, familiar flavours.",
      image: media.timeline.y2020,
      imagePosition: "object-center",
    },
    {
      year: "2021",
      title: "Market stalls",
      tag: "Sydney markets",
      copy: "Before going online, Simran takes her pies straight to Sydney's markets — proving the product one customer, one conversation at a time.",
      image: media.timeline.marketStalls,
      imagePosition: "object-center",
    },
    {
      year: "2021",
      title: "Going live",
      tag: "My Team India",
      copy: "Under the name My Team India, our website launches — bringing handcrafted gourmet pies direct to foodies across Sydney.",
      image: media.timeline.y2021GoingLive,
      imagePosition: "object-center",
    },
    {
      year: "2022",
      title: "Into a commercial kitchen",
      tag: "Scaling up",
      copy: "We step out of the home kitchen and into a licensed commercial kitchen, scaling up to meet growing demand.",
      image: media.timeline.y2022,
      imagePosition: "object-center",
    },
    {
      year: "2024",
      title: "Our own facility",
      tag: "HACCP certified",
      copy: "We move into our own dedicated, HACCP-certified facility, and land our first major wholesale partner.",
      image: media.timeline.y2024,
      imagePosition: "object-center",
    },
    {
      year: "2025",
      title: "Bringing people together",
      tag: "Community-led",
      copy: "Holi Mela reminds us why we started: sharing pies and colour with the community. And as more hotels, caterers and cafes discover us, wholesale becomes a natural extension of that same spirit — feeding more gatherings, just at a bigger scale.",
      image: media.timeline.bringingPeopleTogether,
      imagePosition: "object-center",
    },
    {
      year: "2026",
      title: "Flavour & Co",
      tag: "The next chapter",
      copy: "We rebrand to Flavour & Co, carrying familiar flavours, reimagined, into South Asian canapés and breakfast items at scale.",
      image: media.timeline.y2026,
      imagePosition: "object-center",
      bgClass: "bg-[#07402b]",
      imageFit: "object-contain",
    },
  ];

  const mobileReveal = useRowReveal(milestones.length);
  const desktopReveal = useRowReveal(milestones.length);

  return (
    <section className="relative bg-[#fdf8f3] text-stone-900 border-t border-b border-[#c69c40]/20 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-[#c69c40]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 bg-[#6b1e30]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-6 xl:px-8 relative z-10">
        {/* Header - Minimum Gap to Timeline (mb-2 sm:mb-3 lg:mb-4) */}
        <div className="text-center flex flex-col items-center justify-center mb-2 sm:mb-3 lg:mb-4">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.25em] text-[#6b1e30] mb-2">
            Our history &amp; legacy
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#07402b] font-semibold leading-tight tracking-tight">
            Our journey &amp; <span className="text-[#6b1e30] italic font-normal">milestones</span>
          </h3>
          <div className="mt-3 w-full max-w-[220px]">
            <OrnamentDivider />
          </div>
        </div>

        {/* ============================== MOBILE / TABLET — vertical (below lg) ============================== */}
        <div className="lg:hidden relative max-w-2xl mx-auto">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#c69c40] to-transparent opacity-70"
          />
          <div className="flex flex-col">
            {milestones.map((item, idx) => {
              const imageOnLeft = idx % 2 === 0;
              const filled = idx % 2 === 0;
              const isVisible = mobileReveal.visible.has(idx);

              const image = (
                <ImageFrame
                  item={item}
                  flip={!imageOnLeft}
                  aspectClass="aspect-[4/5] sm:aspect-[4/3]"
                  frameClass="rounded-[8px]"
                  roundClass="rounded-tl-[8px] rounded-br-[8px] rounded-tr-[44px] rounded-bl-[44px]"
                  sizes="(max-width: 640px) 45vw, 380px"
                />
              );
              const story = (
                <StoryContent
                  item={item}
                  ghostClass="-top-3 sm:-top-6 left-1/2 -translate-x-1/2 text-[48px] sm:text-[76px]"
                  titleClass="text-xl sm:text-2xl"
                  bodyClass="text-[13px] sm:text-base"
                  tagClass="text-[10px] sm:text-xs tracking-[0.18em]"
                />
              );

              return (
                <div
                  key={`${item.year}-${item.title}`}
                  ref={(el) => { mobileReveal.nodeRefs.current[idx] = el; }}
                  className={`grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 sm:gap-x-8 py-7 sm:py-12 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                  <div className="w-full">{imageOnLeft ? image : story}</div>
                  <div className="relative z-10 w-14 sm:w-16 aspect-square">
                    <YearSeal year={item.year} filled={filled} />
                  </div>
                  <div className="w-full">{imageOnLeft ? story : image}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================== DESKTOP — horizontal (lg and up) ============================== */}
        <div className="hidden lg:block relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2 right-2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-[#c69c40] to-transparent opacity-70"
          />
          <div className="grid grid-cols-8 gap-2 xl:gap-3.5 relative z-10 min-h-[550px] items-stretch">
            {milestones.map((item, idx) => {
              const imageOnTop = idx % 2 === 0;
              const filled = idx % 2 === 0;
              const isVisible = desktopReveal.visible.has(idx);

              const image = (
                <ImageFrame
                  item={item}
                  flip={!imageOnTop}
                  aspectClass="aspect-[4/3]"
                  frameClass="rounded-[6px]"
                  roundClass="rounded-tl-[6px] rounded-br-[6px] rounded-tr-[24px] rounded-bl-[24px]"
                  sizes="(max-width: 1400px) 11vw, 175px"
                />
              );
              const story = (
                <StoryContent
                  item={item}
                  ghostClass="-top-2 xl:-top-2.5 left-1/2 -translate-x-1/2 text-[30px] xl:text-[38px]"
                  titleClass="text-[12px] xl:text-[14px]"
                  bodyClass="text-[10px] xl:text-[11.5px] leading-snug"
                  tagClass="text-[8px] xl:text-[9.5px] tracking-[0.1em]"
                  maxWidthClass="max-w-none"
                />
              );

              return (
                <div
                  key={`${item.year}-${item.title}`}
                  ref={(el) => { desktopReveal.nodeRefs.current[idx] = el; }}
                  className={`flex flex-col items-center h-full motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                  <div className="w-full flex-1 flex flex-col justify-end">
                    {imageOnTop ? image : story}
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <span
                      aria-hidden="true"
                      className="w-px h-3.5 xl:h-4 bg-gradient-to-b from-[#c69c40]/5 via-[#c69c40] to-[#c69c40]"
                    />
                    <div className="relative my-1 z-20 w-12 xl:w-15 aspect-square">
                      <YearSeal year={item.year} filled={filled} />
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-px h-3.5 xl:h-4 bg-gradient-to-b from-[#c69c40] via-[#c69c40] to-[#c69c40]/5"
                    />
                  </div>

                  <div className="w-full flex-1 flex flex-col justify-start">
                    {imageOnTop ? story : image}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}