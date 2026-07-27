"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ChevronRight } from "lucide-react";
import { faqItems } from "@/lib/data";

export default function FaqClient() {
  // Single open ID state — expanding one automatically collapses any previously open question
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-0 pb-4">
      {/* Minimal & Premium Partition Lines Between Questions (No Top/Bottom Border) */}
      <div className="w-full divide-y divide-[#ebe3d8]">
        {faqItems.map((q) => {
          const isOpen = openId === q.id;
          return (
            <div
              key={q.id}
              className={`transition-colors duration-200 ${
                isOpen ? "bg-[#faf6f0]/60" : "bg-transparent hover:bg-[#faf6f0]/30"
              }`}
            >
              {/* Question Header Button */}
              <button
                onClick={() => toggleItem(q.id)}
                className="w-full text-left py-5 px-4 sm:py-6 sm:px-6 flex items-center justify-between gap-6 focus:outline-none group"
                aria-expanded={isOpen}
              >
                <span className="font-serif font-bold text-base sm:text-lg text-[#1c1410] group-hover:text-[#6b1e30] transition-colors leading-snug">
                  {q.question}
                </span>

                {/* Minimal Dark Circular Toggle Button */}
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-[#6b1e30] text-white rotate-180"
                      : "bg-[#1c1410] group-hover:bg-[#07402b] text-white"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                  )}
                </div>
              </button>

              {/* Silky Smooth Expansion via CSS Grid Rows */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-6 pt-1 sm:px-6 sm:pb-7 text-sm sm:text-base text-[#1c1410]/80 leading-relaxed font-sans whitespace-pre-line border-t border-[#ebe3d8]/40">
                    <p className="pt-2">{q.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle, Simple & Minimal Bottom Contact Link */}
      <div className="mt-12 text-center space-y-2">
        <p className="text-xs sm:text-sm text-[#1c1410]/70 font-sans">
          Have more questions? Can&apos;t find what you&apos;re looking for?
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6b1e30] hover:text-[#07402b] transition-colors underline underline-offset-4 decoration-[#c69c40]"
          >
            Contact Us <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
