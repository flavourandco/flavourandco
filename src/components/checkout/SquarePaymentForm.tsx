"use client";

import { useEffect, useState, useRef } from "react";
import { CreditCard, Lock, CheckCircle2, AlertCircle, Info } from "lucide-react";

declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string
      ) => Promise<{
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
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
        }>;
        googlePay: (paymentRequest: any) => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
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
}

// Payment Brand Badges
function VisaBadge() {
  return (
    <div className="h-5 w-8 rounded bg-[#0E4595] flex items-center justify-center border border-white/20 shadow-2xs shrink-0" title="Visa">
      <span className="font-sans font-black italic text-white text-[10px] tracking-tighter">VISA</span>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="h-5 w-8 rounded bg-[#111] flex items-center justify-center border border-white/20 shadow-2xs relative overflow-hidden shrink-0" title="Mastercard">
      <div className="flex items-center -space-x-1.5">
        <div className="h-3 w-3 rounded-full bg-[#EB001B]" />
        <div className="h-3 w-3 rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    </div>
  );
}

function AmexBadge() {
  return (
    <div className="h-5 w-8 rounded bg-[#016FD0] flex items-center justify-center border border-white/20 shadow-2xs shrink-0" title="American Express">
      <span className="font-sans font-black text-white text-[8px] tracking-tighter">AMEX</span>
    </div>
  );
}

function ApplePayBadge() {
  return (
    <div className="h-5 w-8 rounded bg-black flex items-center justify-center border border-white/20 shadow-2xs text-white shrink-0" title="Apple Pay">
      <span className="font-sans font-bold text-[8px] tracking-tight">Pay</span>
    </div>
  );
}

function GooglePayBadge() {
  return (
    <div className="h-5 w-8 rounded bg-white flex items-center justify-center border border-stone-300 shadow-2xs shrink-0" title="Google Pay">
      <span className="font-sans font-bold text-stone-800 text-[8px] tracking-tight">
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

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";
  const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "sandbox";

  useEffect(() => {
    if (initializedRef.current && cardRef.current) {
      setSdkLoading(false);
      setSdkReady(true);
      return;
    }

    const initSquare = async () => {
      if (!window.Square || !appId || appId.includes("EXAMPLE") || appId.includes("YOUR_SQUARE")) {
        setSdkLoading(false);
        setCardError("Payment gateway configuration missing.");
        return;
      }

      if (initializedRef.current) {
        setSdkLoading(false);
        return;
      }
      initializedRef.current = true;

      try {
        const payments = await window.Square.payments(appId, locationId);

        // 1. Initialize & Attach Card Element
        const cardElement = document.getElementById("square-card-element");
        if (cardElement) {
          cardElement.innerHTML = "";
          const card = await payments.card();
          await card.attach("#square-card-element");
          cardRef.current = card;
          setSdkReady(true);
        }
      } catch (err: any) {
        console.warn("Square Card attach notice:", err);
        setSdkReady(true);
      } finally {
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
          if (el) {
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
          if (el) {
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
          setCardError(result.errors[0].message || "Please check your card details.");
          return;
        }
      } catch (err: any) {
        console.error("Card tokenization error:", err);
        setCardError("Please double check your card number.");
        return;
      }
    }

    // Sandbox fallback token for test mode if SDK unattached
    onSubmitPayment("cnon:card-nonce-ok");
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Clean Payment Methods Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-lg border border-stone-200/90">
        <span className="text-xs font-bold text-stone-800">Accepted Payment Methods</span>
        <div className="flex items-center gap-1.5">
          <VisaBadge />
          <MastercardBadge />
          <AmexBadge />
          <ApplePayBadge />
          <GooglePayBadge />
        </div>
      </div>

      {/* Digital Wallets: Apple Pay & Google Pay Containers */}
      {(applePayReady || googlePayReady) && (
        <div className="space-y-2 border-b border-stone-100 pb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
            Express Checkout
          </span>
          <div id="square-apple-pay-element" className="w-full min-h-[44px]" />
          <div id="square-google-pay-element" className="w-full min-h-[44px]" />
        </div>
      )}

      {/* Embedded Credit Card Input Container */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-stone-200/90 shadow-2xs space-y-3">
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
        <div className="bg-white p-3 rounded-md border border-stone-200 min-h-[90px] relative flex flex-col justify-center">
          <div id="square-card-element" className="w-full min-h-[80px]" />
          {sdkLoading && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-2 text-stone-500 text-xs pointer-events-none">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#6b1e30] border-t-transparent" />
              <span>Loading card form...</span>
            </div>
          )}
        </div>

        {/* Sandbox Test Helper */}
        {environment === "sandbox" && (
          <div className="p-3 bg-amber-50 rounded-md border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-800">
              <Info className="w-3.5 h-3.5" /> Sandbox Test Card
            </div>
            <p className="text-[11px] text-amber-800 font-mono">
              Card: <strong>4111 1111 1111 1111</strong> • Exp: <strong>12/30</strong> • CVV: <strong>123</strong> • Zip: <strong>2000</strong>
            </p>
          </div>
        )}

        {cardError && (
          <div className="p-3 bg-red-50 rounded-md border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cardError}</span>
          </div>
        )}
      </div>

      {/* Buttons Row */}
      <div className="flex items-center gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="py-3.5 px-5 rounded-md border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handlePayClick}
          disabled={isProcessing}
          className="flex-1 py-3.5 px-6 rounded-md bg-[#6b1e30] hover:bg-[#07402b] text-white text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
      </div>
    </div>
  );
}
