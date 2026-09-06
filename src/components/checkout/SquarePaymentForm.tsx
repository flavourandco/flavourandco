"use client";

import { useEffect, useState, useRef } from "react";
import { CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { humanizePaymentError } from "@/lib/square";

declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string
      ) => Promise<{
        card: (options?: any) => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
          destroy?: () => Promise<void>;
        }>;
        paymentRequest: (options: {
          countryCode: string;
          currencyCode: string;
          total: { amount: string; label: string };
        }) => any;
        applePay: (paymentRequest: any) => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
          destroy?: () => Promise<void>;
        }>;
        googlePay: (paymentRequest: any) => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
          destroy?: () => Promise<void>;
        }>;
      }>;
    };
  }
}

interface SquarePaymentFormProps {
  onSubmitPayment: (sourceId: string) => void;
  onCancel?: () => void;
  isProcessing: boolean;
  totalAmount: number;
  postcode?: string;
  addressSummary?: string;
  externalError?: string | null;
}

// Payment Brand Badges
function VisaBadge() {
  return (
    <div className="h-8 sm:h-7 w-full rounded-sm bg-[#0E4595] flex items-center justify-center border border-white/20 shadow-2xs" title="Visa">
      <span className="font-sans font-black italic text-white text-xs tracking-tighter">VISA</span>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="h-8 sm:h-7 w-full rounded-sm bg-[#111] flex items-center justify-center border border-white/20 shadow-2xs relative overflow-hidden" title="Mastercard">
      <div className="flex items-center -space-x-1.5">
        <div className="h-3.5 w-3.5 rounded-full bg-[#EB001B]" />
        <div className="h-3.5 w-3.5 rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    </div>
  );
}

function AmexBadge() {
  return (
    <div className="h-8 sm:h-7 w-full rounded-sm bg-[#016FD0] flex items-center justify-center border border-white/20 shadow-2xs" title="American Express">
      <span className="font-sans font-black text-white text-[10px] tracking-tighter">AMEX</span>
    </div>
  );
}

function ApplePayBadge() {
  return (
    <div className="h-8 sm:h-7 w-full rounded-sm bg-black flex items-center justify-center border border-white/20 shadow-2xs text-white" title="Apple Pay">
      <span className="font-sans font-bold text-[10px] tracking-tight">Pay</span>
    </div>
  );
}

function GooglePayBadge() {
  return (
    <div className="h-8 sm:h-7 w-full rounded-sm bg-white flex items-center justify-center border border-stone-300 shadow-2xs" title="Google Pay">
      <span className="font-sans font-bold text-stone-800 text-[10px] tracking-tight">
        <span className="text-[#4285F4]">G</span>Pay
      </span>
    </div>
  );
}

export default function SquarePaymentForm({
  onSubmitPayment,
  onCancel,
  isProcessing,
  totalAmount,
  externalError,
}: SquarePaymentFormProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [cardError, setCardError] = useState<string | null>(null);
  const [applePayReady, setApplePayReady] = useState(false);
  const [googlePayReady, setGooglePayReady] = useState(false);

  const cardRef = useRef<any>(null);
  const applePayRef = useRef<any>(null);
  const googlePayRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const isInitializingRef = useRef(false);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";
  const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "sandbox";

  // Active error to display directly below card input (humanized & simplified)
  const activeError = (cardError || externalError)
    ? humanizePaymentError(cardError || externalError)
    : null;

  useEffect(() => {
    // If already active and attached, no need to re-initialize
    if (initializedRef.current && cardRef.current) {
      setSdkLoading(false);
      setSdkReady(true);
      return;
    }

    const initSquare = async () => {
      // Prevent multiple concurrent initializations (which caused double card input rendering)
      if (isInitializingRef.current || initializedRef.current) {
        return;
      }

      if (!window.Square || !appId || appId.includes("EXAMPLE") || appId.includes("YOUR_SQUARE")) {
        setSdkLoading(false);
        setCardError("Payment gateway configuration missing.");
        return;
      }

      isInitializingRef.current = true;

      try {
        const payments = await window.Square.payments(appId, locationId);

        // 1. Initialize & Attach Card Element with standard native validation
        const cardElement = document.getElementById("square-card-element");
        if (cardElement) {
          // Clear any leftover child nodes completely
          cardElement.innerHTML = "";

          // Clean up old instance before creating a new one
          if (cardRef.current && typeof cardRef.current.destroy === "function") {
            try {
              await cardRef.current.destroy();
            } catch {}
            cardRef.current = null;
          }

          // Use default card options (Square natively manages ZIP/postal code per card country)
          const card = await payments.card();
          
          // Re-verify container is ready and not already populated
          if (cardElement && cardElement.children.length === 0) {
            await card.attach("#square-card-element");
            cardRef.current = card;
            initializedRef.current = true;
            setSdkReady(true);
          } else {
            try {
              if (typeof card?.destroy === "function") {
                await card.destroy();
              }
            } catch {}
          }
        }
      } catch (err: any) {
        console.error("Square Card initialization error:", err);
        initializedRef.current = false;
        setCardError(err?.message || "Could not initialize credit card input.");
      } finally {
        isInitializingRef.current = false;
        setSdkLoading(false);
      }

      // 2. Optional Digital Wallets Initialization
      try {
        const payments = await window.Square.payments(appId, locationId);
        const req = payments.paymentRequest({
          countryCode: "AU",
          currencyCode: "AUD",
          total: {
            amount: (totalAmount || 15).toFixed(2),
            label: "Flavour & Co. Order Total",
          },
        });

        try {
          const applePay = await payments.applePay(req);
          const el = document.getElementById("square-apple-pay-element");
          if (el && el.children.length === 0) {
            await applePay.attach("#square-apple-pay-element");
            applePayRef.current = applePay;
            setApplePayReady(true);
          }
        } catch {
          // Apple Pay unsupported on non-Safari devices
        }

        try {
          const googlePay = await payments.googlePay(req);
          const el = document.getElementById("square-google-pay-element");
          if (el && el.children.length === 0) {
            await googlePay.attach("#square-google-pay-element");
            googlePayRef.current = googlePay;
            setGooglePayReady(true);
          }
        } catch {
          // Google Pay unsupported or unconfigured
        }
      } catch {
        // Digital wallet request ignored
      }
    };

    // Dynamically load Square Web Payments SDK Script
    const scriptId = "square-web-payments-sdk";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        environment === "production"
          ? "https://web.squarecdn.com/v1/square.js"
          : "https://sandbox.web.squarecdn.com/v1/square.js";
      script.onload = () => {
        initSquare();
      };
      script.onerror = () => {
        setSdkLoading(false);
        setCardError("Could not load payment script.");
      };
      document.body.appendChild(script);
    } else if (window.Square) {
      initSquare();
    }

    return () => {
      isInitializingRef.current = false;
      initializedRef.current = false;
      if (cardRef.current && typeof cardRef.current.destroy === "function") {
        try {
          cardRef.current.destroy();
        } catch {}
      }
      cardRef.current = null;
      const cardElement = document.getElementById("square-card-element");
      if (cardElement) {
        cardElement.innerHTML = "";
      }
    };
  }, [appId, locationId, environment]);

  const handlePayClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);

    // If active Card element exists, tokenize details securely
    if (cardRef.current && sdkReady) {
      try {
        const result = await cardRef.current.tokenize();
        if (result.status === "OK" && result.token) {
          onSubmitPayment(result.token);
          return;
        } else if (result.errors && result.errors.length > 0) {
          const errorMsg = result.errors
            .map((err: any) => err.message)
            .filter(Boolean)
            .join(". ");
          setCardError(errorMsg || "Please check your card details.");
          return;
        }
      } catch (err: any) {
        console.error("Card tokenization error:", err);
        setCardError("Please double check your card number, expiration date, and CVV.");
        return;
      }
    }

    // Sandbox fallback token for test mode if SDK unattached
    onSubmitPayment("cnon:card-nonce-ok");
  };

  return (
    <div className="space-y-4 font-sans w-full">
      {/* Clean Payment Methods Header - Full Width Grid */}
      <div className="p-3 sm:p-4 bg-stone-50 rounded-sm border border-stone-200/90 space-y-2 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider">Accepted Payment Methods</span>
          <span className="text-[10px] text-stone-400 font-mono">100% Encrypted</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full pt-0.5">
          <VisaBadge />
          <MastercardBadge />
          <AmexBadge />
          <ApplePayBadge />
          <GooglePayBadge />
        </div>
      </div>

      {/* Digital Wallets: Apple Pay & Google Pay Containers */}
      {(applePayReady || googlePayReady) && (
        <div className="space-y-2 border-b border-stone-100 pb-4 w-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
            Express Checkout
          </span>
          <div id="square-apple-pay-element" className="w-full min-h-[44px]" />
          <div id="square-google-pay-element" className="w-full min-h-[44px]" />
        </div>
      )}

      {/* Embedded Credit Card Input Container */}
      <div className="bg-white p-3.5 sm:p-5 rounded-sm border border-stone-200/90 shadow-2xs space-y-3 w-full">
        <div className="flex items-center justify-between">
          <label className="font-bold uppercase tracking-wider text-stone-800 text-[11px] flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#6b1e30]" />
            <span>Pay with Card</span>
          </label>
          <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#07402b]" /> Secure Checkout
          </span>
        </div>

        {/* Square SDK Container: Embedded Card Input Fields */}
        <div className={`bg-white p-2 sm:p-3 rounded-sm border transition-colors min-h-[90px] w-full relative flex flex-col justify-center overflow-hidden ${activeError ? "border-red-400" : "border-stone-200"}`}>
          <div id="square-card-element" className="w-full min-w-full min-h-[80px]" />
          {sdkLoading && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-2 text-stone-500 text-xs pointer-events-none">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#6b1e30] border-t-transparent" />
              <span>Loading card form...</span>
            </div>
          )}
        </div>

        {/* Clean & Simple Inline Card Error */}
        {activeError && (
          <div className="flex items-center gap-1.5 px-0.5 pt-0.5 text-red-600 text-xs font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span className="leading-snug">{activeError}</span>
          </div>
        )}
      </div>

      {/* Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 w-full">
        <button
          type="button"
          onClick={handlePayClick}
          disabled={isProcessing}
          className="w-full sm:flex-1 py-4 px-6 rounded-sm bg-[#6b1e30] hover:bg-[#07402b] text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Pay A${totalAmount.toFixed(2)} AUD</span>
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto py-3 px-5 rounded-sm border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 text-center order-2 sm:order-1"
          >
            Cancel &amp; Return to Cart
          </button>
        )}
      </div>
    </div>
  );
}
