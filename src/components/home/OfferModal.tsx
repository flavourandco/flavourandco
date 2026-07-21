"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Truck, Award, Flame } from "lucide-react";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces-modal",
});

export default function OfferModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup immediately when website loads
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
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

      {/* Modal Container — Wider landscape layout on PC, compact on mobile */}
      <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl overflow-hidden rounded-xl bg-base-100 border-2 border-secondary/30 p-6 sm:p-8 md:p-10 shadow-2xl transition-all transform scale-100 z-10 text-base-content">
        {/* Square Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close offer modal"
          className="absolute right-3 top-3 sm:right-5 sm:top-5 flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-content hover:bg-primary hover:text-primary-content transition-all border border-secondary/30 z-30 cursor-pointer shadow-md"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        {/* Ambient background accent */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10 pt-4 md:pt-2">
          {/* Left Column: Brand & Title Stack */}
          <div className="md:col-span-6 text-center md:text-left flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-secondary/40 bg-base-200/80 px-3.5 py-1 text-[10px] font-mono font-medium uppercase tracking-[0.25em] text-secondary mb-3 self-center md:self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary inline-block" />
              <span>Est. by Ash &amp; Simran</span>
            </div>

            <h2
              style={{ fontFamily: "var(--font-fraunces-modal, 'Fraunces', serif)" }}
              className="text-2xl sm:text-3xl md:text-3.5xl font-semibold leading-[1.1] tracking-tight text-primary uppercase"
            >
              Handcrafted <span className="italic font-medium text-secondary">Fusion</span>
              <span className="block font-bold mt-0.5 text-primary">Artisan Pies</span>
            </h2>

            {/* HomeHero crimp divider */}
            <div className="flex justify-center md:justify-start mt-3 mb-2">
              <svg className="h-3 w-40 text-secondary" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M0,6 Q10,0 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <p className="text-xs sm:text-sm text-base-content/80 max-w-sm mx-auto md:mx-0 leading-relaxed mt-2">
              Slow-cooked Indian spiced curries wrapped in 100% all-butter Australian flaky pastry.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em] text-base-content/60">
              <span>Cardamom</span>
              <span className="text-secondary">·</span>
              <span>Ghee</span>
              <span className="text-secondary">·</span>
              <span>Golden Flaky Pastry</span>
            </div>
          </div>

          {/* Right Column: Value Highlights & Action Buttons */}
          <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4 pt-4 md:pt-6 md:pr-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3.5 rounded-md bg-base-200/70 p-3 border border-secondary/20 transition-all hover:border-secondary/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-content">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Free Express Delivery
                  </h4>
                  <p className="text-[11px] opacity-75">
                    Fresh temperature-controlled Sydney delivery on orders over $100
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-md bg-base-200/70 p-3 border border-secondary/20 transition-all hover:border-secondary/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-content">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Channel 7 Featured
                  </h4>
                  <p className="text-[11px] opacity-75">
                    Award-winning recipes showcased on TV&apos;s Plate of Origin
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-md bg-base-200/70 p-3 border border-secondary/20 transition-all hover:border-secondary/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-content">
                  <Flame className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Baked Fresh Daily
                  </h4>
                  <p className="text-[11px] opacity-75">
                    Crafted in small batches &amp; delivered ready to heat and savor
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col gap-2">
              <Link
                href="/shop"
                onClick={handleClose}
                className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary-content shadow-lg hover:bg-secondary hover:text-secondary-content transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Order Fresh Pies Now</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={handleClose}
                type="button"
                className="w-full text-center text-[11px] font-medium opacity-60 hover:opacity-100 transition-colors py-1 cursor-pointer"
              >
                No thanks, I will browse first
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
