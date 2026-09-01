"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Check, Copy, Sparkles, Loader2 } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [discountCode, setDiscountCode] = useState("PIECLUB10");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "offer_modal" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setDiscountCode(data.discountCode || "PIECLUB10");
      setIsSuccess(true);

      // Save email and promo code in localStorage for automatic checkout discount
      try {
        localStorage.setItem("flavour_subscriber_email", email.toLowerCase().trim());
        localStorage.setItem("flavour_applied_discount_code", data.discountCode || "PIECLUB10");
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className={`${fraunces.variable} fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn overflow-y-auto`} data-lenis-prevent>
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container — Split-screen layout with left brand-green bg, right cream content */}
      <div className="relative w-full max-w-lg md:max-w-3xl max-h-[88vh] overflow-y-auto overscroll-contain rounded-xl bg-cream border border-brand-gold/30 shadow-2xl transition-all transform scale-100 z-10 text-base-content p-0 my-auto shrink-0" data-lenis-prevent>
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
            {!isSuccess ? (
              <>
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
                  Join the Flavour &amp; Co. family! Subscribe to our newsletter to receive an exclusive <span className="text-[#6b1e30] font-extrabold">10% discount</span> on your very first order.
                </p>

                {errorMessage && (
                  <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-md border border-secondary/30 bg-white focus:outline-none focus:border-brand-green text-stone-800 placeholder:text-stone-400 shadow-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white font-bold uppercase tracking-wider py-3 px-6 rounded-md text-[10px] sm:text-xs transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe &amp; Claim 10% Off</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={handleClose}
                  type="button"
                  className="mt-4 text-center md:text-left text-[11px] font-medium opacity-60 hover:opacity-100 transition-colors py-1 cursor-pointer"
                >
                  No thanks, I will browse first
                </button>
              </>
            ) : (
              /* Success State with Copyable Promo Code */
              <div className="space-y-4 text-center md:text-left animate-fadeIn">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Welcome to the Family!</span>
                </div>

                <h2
                  style={{ fontFamily: "var(--font-fraunces-modal, 'Fraunces', serif)" }}
                  className="text-2xl sm:text-3xl font-semibold leading-tight text-brand-green uppercase"
                >
                  Your 10% Discount Code is Ready
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  Use this coupon code at checkout with your email (<strong className="text-stone-800">{email}</strong>) to enjoy 10% off your first handcrafted order:
                </p>

                {/* Promo Code Box */}
                <div className="p-3.5 bg-white border-2 border-dashed border-[#c69c40] rounded-xl flex items-center justify-between shadow-xs">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-widest">Coupon Code</span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#6b1e30] tracking-wider">
                      {discountCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#07402b] hover:bg-[#c69c40] text-white hover:text-[#07402b] font-bold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full bg-[#6b1e30] hover:bg-[#85253c] text-white font-bold uppercase tracking-wider py-3 px-6 rounded-md text-xs transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Start Shopping with 10% Off</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

