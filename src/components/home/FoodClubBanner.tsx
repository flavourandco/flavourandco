"use client";

import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";

export default function FoodClubBanner() {
  return (
    <section className="bg-base-100 py-8 border-b border-secondary/15 text-base-content">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="rounded-2xl border-2 border-dashed border-secondary/40 bg-base-200 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden shadow-sm">
          {/* Subtle background glow */}
          <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 text-secondary font-bold text-xs uppercase tracking-widest mb-2">
              <Gift className="h-4 w-4" />
              <span>Welcome Special</span>
            </div>

            <h2 className="font-fraunces text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
              $10 Off <span className="italic font-medium text-secondary">Your First Order</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm opacity-70 leading-relaxed font-medium">
              Join the Flavour & Co. Pie Club for exclusive seasonal batch releases, chef pairing recipes, and member discounts delivered straight to your inbox.
            </p>

            <form className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-md border border-secondary/30 bg-base-100 px-4 py-2.5 text-xs text-base-content placeholder:text-base-content/40 focus:border-secondary focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-primary hover:bg-secondary text-primary-content hover:text-secondary-content px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shrink-0"
              >
                Join Pie Club
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
