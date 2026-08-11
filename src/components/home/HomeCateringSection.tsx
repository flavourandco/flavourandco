"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

export default function HomeCateringSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(".catering-content > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-14 w-full bg-[#1c1410] text-white border-b border-[#c69c40]/15"
    >
      {/* Background Image with Dark Vignette Overlay (Matching Our Approach section) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={media.moods.gather}
          alt="Flavour & Co Catering Background"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1410] via-[#1c1410]/80 to-[#1c1410] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      </div>

      <div className="catering-content relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c69c40] mb-3">
          Catering Services
        </p>

        <h2 className="font-serif text-2.5xl sm:text-3.5xl md:text-4xl text-white leading-[1.18] font-semibold tracking-tight">
          Bring Flavour &amp; Co. to Your <span className="italic text-[#c69c40]">Next Event</span>
        </h2>

        <p className="mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-white/80 max-w-xl mx-auto font-sans">
          From corporate lunches to private celebrations, we provide hot, handcrafted pies and custom gourmet platters tailored to your gathering.
        </p>

        {/* Hero-style Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="group relative overflow-hidden inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#6b1e30] px-6 sm:px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#F2E6D3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A72B] shadow-sm whitespace-nowrap"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              <span>Inquire for Catering</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            {/* Sliding gold underline from bottom edge left-to-right */}
            <span className="absolute bottom-0 left-0 h-[3px] bg-[#c69c40] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>

          <Link
            href="/wholesale"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-[#F2E6D3]/30 px-6 sm:px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#F2E6D3]/90 transition-colors hover:border-[#F2E6D3] hover:bg-[#F2E6D3]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A72B] shadow-sm whitespace-nowrap"
          >
            <span>Corporate &amp; Wholesale</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
