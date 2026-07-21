"use client";

import { Quote } from "lucide-react";

export default function PhilosophyQuote() {
  return (
    <section className="bg-base-200 py-16 md:py-20 border-b border-secondary/15 relative overflow-hidden text-center text-base-content">
      <div className="mx-auto max-w-4xl px-6 relative z-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary mb-6 border border-secondary/20">
          <Quote className="h-5 w-5" />
        </div>

        <blockquote className="font-fraunces text-xl sm:text-2xl md:text-3xl text-primary leading-snug font-semibold">
          &ldquo;Our food philosophy will always remain: to cook from the heart, baking our <span className="italic font-medium text-secondary">Indian heritage</span> into light, flaky Australian pies.&rdquo;
        </blockquote>

        <div className="mt-6 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
            Ash & Simran
          </span>
          <span className="text-[11px] opacity-60 tracking-wider uppercase mt-1">
            Founders & Bakers — Flavour & Co.
          </span>
        </div>
      </div>
    </section>
  );
}
