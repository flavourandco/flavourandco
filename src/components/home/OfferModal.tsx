"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Fraunces } from "next/font/google";
import { media } from "@/lib/media";
import { setWithTTL, hasExpired } from "@/lib/storage";

const POPUP_KEY = "offer-popup-dismissed";
const POPUP_TTL = 10 * 60 * 1000; // 10 minutes

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces-modal",
});

export default function OfferModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if the popup TTL has expired or has never been dismissed
    if (hasExpired(POPUP_KEY)) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setWithTTL(POPUP_KEY, POPUP_TTL);
  };

  if (!isOpen) return null;

  return (
    <div className={`${fraunces.variable} fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn`}>
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container — Split-screen layout with left brand-green bg, right cream content */}
      <div className="relative w-full max-w-lg md:max-w-3xl overflow-hidden rounded-xl bg-cream border border-brand-gold/30 shadow-2xl transition-all transform scale-100 z-10 text-base-content p-0">
        {/* Rounded Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close offer modal"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#1b1410]/20 hover:bg-[#1b1410]/40 text-stone-800 transition-all z-30 cursor-pointer shadow-md"
        >
          <X className="h-4.5 w-4.5 stroke-[2.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-0 relative z-10">
          {/* Left Column: Full Green Background (#07402b) (40% width) */}
          <div className="md:col-span-4 bg-brand-green flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[220px] md:min-h-[380px] relative overflow-hidden">
            {/* Subtle brand gold glow in left background */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-brand-gold blur-2xl animate-pulse" />
            </div>
            
            <img
              src={media.footerLogo}
              alt="Flavour & Co. Logo"
              className="w-full h-auto max-w-[200px] md:max-w-full object-contain transition-transform duration-500 hover:scale-105 relative z-10"
            />
          </div>

          {/* Right Column: Coupon & Subscribing details (60% width) */}
          <div className="md:col-span-6 flex flex-col justify-center p-6 sm:p-8 md:p-10 text-center md:text-left bg-cream">
            <h2
              style={{ fontFamily: "var(--font-fraunces-modal, 'Fraunces', serif)" }}
              className="text-2xl sm:text-3xl md:text-3.5xl font-semibold leading-[1.1] tracking-tight text-brand-green uppercase"
            >
              Get <span className="text-[#6b1e30] italic font-medium">10% Off</span>
              <span className="block font-bold mt-1 text-brand-green">Your First Order</span>
            </h2>

            {/* Crimp Divider Line in Gold */}
            <div className="flex justify-center md:justify-start mt-3 mb-2">
              <svg className="h-3 w-40 text-brand-gold" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M0,6 Q10,0 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2 font-medium">
              Join the Flavour &amp; Co. family! Subscribe to our newsletter to receive a <span className="text-[#6b1e30] font-extrabold">10% discount code</span> on your first order of handcrafted Indo-Australian pies.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Welcome to the family! Use discount code: PIECLUB10 at checkout to get 10% off.");
                handleClose();
              }}
              className="mt-5 space-y-3"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-md border border-secondary/30 bg-white focus:outline-none focus:border-brand-green text-stone-800 placeholder:text-stone-400 shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white font-bold uppercase tracking-wider py-3 px-6 rounded-md text-[10px] sm:text-xs transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Subscribe &amp; Claim 10% Off</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <button
              onClick={handleClose}
              type="button"
              className="mt-4 text-center md:text-left text-[11px] font-medium opacity-60 hover:opacity-100 transition-colors py-1 cursor-pointer"
            >
              No thanks, I will browse first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
