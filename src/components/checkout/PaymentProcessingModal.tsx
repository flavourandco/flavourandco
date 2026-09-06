"use client";

import { useState, useEffect } from "react";
import { CreditCard, Store } from "lucide-react";

export type PaymentModalStage = "transferring" | "confirmed" | "cancelled";

export interface PaymentProcessingModalProps {
  isOpen: boolean;
  totalAmount?: number;
  customerName?: string;
  stage?: PaymentModalStage;
  autoTransition?: boolean;
}

export function PaymentProcessingModal({
  isOpen,
  totalAmount = 65.0,
  customerName = "You",
  stage: controlledStage,
  autoTransition = true,
}: PaymentProcessingModalProps) {
  const [internalStage, setInternalStage] = useState<PaymentModalStage>("transferring");

  const currentStage = controlledStage || internalStage;

  useEffect(() => {
    if (!isOpen) {
      setInternalStage("transferring");
      return;
    }

    if (autoTransition && !controlledStage) {
      const timer = setTimeout(() => {
        setInternalStage("confirmed");
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoTransition, controlledStage]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out] select-none"
    >
      <div className="relative w-full max-w-md h-[300px] sm:h-[320px] bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-stone-800 animate-[fadeIn_0.3s_ease-out] overflow-hidden flex flex-col justify-center">

        {currentStage === "transferring" && (
          /* ================= 1. TRANSFERRING MONEY ================= */
          <div className="w-full flex flex-col justify-between h-full animate-[fadeIn_0.3s_ease-out]">

            {/* Amount Header */}
            <div className="text-center pt-0.5">
              <p className="text-xs sm:text-sm font-medium text-stone-500 mb-1">
                Sending payment
              </p>
              <div className="flex items-baseline justify-center">
                <span className="font-sans text-[2.75rem] leading-none font-semibold tracking-tight text-stone-900 tabular-nums">
                  A${Number(totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Money-in-motion: two larger nodes, a thin track, comet travelling between them */}
            <div className="relative flex items-center justify-between h-20 px-1 my-auto">

              {/* Customer Node */}
              <div className="z-10 flex flex-col items-center gap-2 shrink-0 min-w-[70px]">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#6b1e30] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(107,30,48,0.28)] ring-1 ring-black/5">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">
                  {customerName}
                </span>
              </div>

              {/* Track Line connecting the larger circles */}
              <div className="absolute left-[64px] right-[84px] top-[26px] sm:top-[28px] h-px bg-stone-200">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-[#c69c40]"
                    style={{
                      boxShadow: i === 0 ? "0 0 10px rgba(198,156,64,0.7)" : "none",
                      opacity: 1 - i * 0.32,
                      transform: `translateY(-50%) scale(${1 - i * 0.18})`,
                      animation: "travel 1.8s cubic-bezier(0.45,0,0.55,1) infinite",
                      animationDelay: `${-i * 0.16}s`,
                    }}
                  />
                ))}
              </div>

              {/* Store Node (Flavour and Co fully written and unwrapped) */}
              <div className="z-10 flex flex-col items-center gap-2 shrink-0 min-w-[95px]">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#07402b] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(7,64,43,0.28)] ring-1 ring-black/5">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">
                  Flavour and Co
                </span>
              </div>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-center gap-2 pb-0.5">
              <span className="text-xs sm:text-sm font-medium text-stone-600">
                Confirming with your bank
              </span>
              <span className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#c69c40]"
                    style={{
                      animation: "dotPulse 1.3s ease-in-out infinite",
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        {currentStage === "confirmed" && (
          /* ================= 2. PAYMENT CONFIRMED (BIG TICK) ================= */
          <div className="w-full flex flex-col items-center justify-center h-full text-center py-2">

            <div className="relative my-3 flex items-center justify-center">

              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-400/30 animate-[rippleRing_1.8s_ease-out_infinite]" />

              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#07402b]/20 animate-[rippleRing_1.8s_ease-out_infinite_0.6s]" />

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#07402b] via-[#0b5439] to-[#128059] text-white flex items-center justify-center shadow-[0_12px_35px_rgba(7,64,43,0.35)] animate-[popZoomTick_0.75s_cubic-bezier(0.34,1.56,0.64,1)_forwards] z-10">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    className="animate-[drawCheckmark_0.6s_ease-out_0.2s_forwards]"
                    style={{
                      strokeDasharray: 50,
                      strokeDashoffset: 50,
                    }}
                  />
                </svg>
              </div>
            </div>

            <div className="pt-2 animate-[fadeIn_0.5s_ease-out_0.35s_both]">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#07402b]">
                Payment Confirmed!
              </h3>
            </div>

          </div>
        )}

        {currentStage === "cancelled" && (
          /* ================= 3. PAYMENT CANCELLED (BIG CROSS) ================= */
          <div className="w-full flex flex-col items-center justify-center h-full text-center py-2">

            <div className="relative my-3 flex items-center justify-center">

              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-400/30 animate-[rippleRing_1.8s_ease-out_infinite]" />

              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#6b1e30]/20 animate-[rippleRing_1.8s_ease-out_infinite_0.6s]" />

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#6b1e30] via-[#851e36] to-[#b32b49] text-white flex items-center justify-center shadow-[0_12px_35px_rgba(107,30,48,0.35)] animate-[popZoomTick_0.75s_cubic-bezier(0.34,1.56,0.64,1)_forwards] z-10">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    className="animate-[drawCheckmark_0.45s_ease-out_0.2s_forwards]"
                    style={{
                      strokeDasharray: 50,
                      strokeDashoffset: 50,
                    }}
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    className="animate-[drawCheckmark_0.45s_ease-out_0.35s_forwards]"
                    style={{
                      strokeDasharray: 50,
                      strokeDashoffset: 50,
                    }}
                  />
                </svg>
              </div>
            </div>

            <div className="pt-2 animate-[fadeIn_0.5s_ease-out_0.35s_both]">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1e30]">
                Payment Cancelled
              </h3>
            </div>

          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes travel {
          0%   { left: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-1px); }
        }

        @keyframes popZoomTick {
          0% { transform: scale(0.15); opacity: 0; }
          55% { transform: scale(1.25); opacity: 1; }
          75% { transform: scale(0.92); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes drawCheckmark {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes rippleRing {
          0% { transform: scale(0.7); opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default PaymentProcessingModal;