"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  XCircle,
  AlertCircle,
  MapPin,
  ShoppingBag,
  RotateCw,
  Phone,
  HelpCircle,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Truck,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useCartStore } from "@/store/cart.store";

interface FailedOrderInfo {
  id: string;
  orderNumber: string;
  totalAmount: number;
  subtotal?: number;
  shippingFee?: number;
  customer?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
  };
  items?: Array<{
    id: string;
    name: string;
    image: string;
    unitPrice: number;
    quantity: number;
    variantName?: string;
  }>;
}

function FailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawReason = searchParams.get("reason") || searchParams.get("error");
  const orderId = searchParams.get("orderId");

  const cartItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore((s) => s.getSubtotal());
  const cartShippingFee = useCartStore((s) => s.getShippingFee());
  const cartTotal = useCartStore((s) => s.getTotal());

  const [loadingOrder, setLoadingOrder] = useState(Boolean(orderId));
  const [orderInfo, setOrderInfo] = useState<FailedOrderInfo | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Friendly error formatter
  const getReadableReason = (reason?: string | null): { title: string; desc: string; tip: string } => {
    if (!reason) {
      return {
        title: "Payment Authorization Failed",
        desc: "Your bank or card issuer could not authorize this transaction.",
        tip: "Please verify your card details, check your bank app for approvals, or try an alternative payment method.",
      };
    }

    const lower = reason.toLowerCase();

    if (lower.includes("declined") || lower.includes("card_declined") || lower.includes("generic_decline")) {
      return {
        title: "Card Declined by Your Bank",
        desc: "Your card issuer declined this transaction. This typically occurs due to bank security rules, daily limits, or temporary bank holds.",
        tip: "Check your banking app for an authorization prompt, verify your available balance, or contact your card issuer.",
      };
    }

    if (lower.includes("insufficient_funds") || lower.includes("insufficient funds") || lower.includes("not enough funds")) {
      return {
        title: "Insufficient Funds",
        desc: "The transaction could not be completed due to insufficient balance on the selected card.",
        tip: "Please top up your account or select a different payment card to complete your order.",
      };
    }

    if (lower.includes("cvv") || lower.includes("cvc") || lower.includes("verification") || lower.includes("security code")) {
      return {
        title: "Card Security Code (CVV) Mismatch",
        desc: "The 3-digit security code (CVV) entered did not match your bank's records.",
        tip: "Please double-check the 3-digit code on the back of your card (or 4-digit code on the front for AMEX).",
      };
    }

    if (lower.includes("expired") || lower.includes("expiration")) {
      return {
        title: "Card Expired",
        desc: "The expiration date provided is in the past or invalid.",
        tip: "Please check the expiry date on your card and ensure it has not passed.",
      };
    }

    if (lower.includes("postcode") || lower.includes("sydney") || lower.includes("delivery zone")) {
      return {
        title: "Delivery Zone Restriction",
        desc: reason,
        tip: "Our handcrafted refrigerated deliveries currently serve Greater Sydney (up to 50km).",
      };
    }

    if (lower.includes("timeout") || lower.includes("network") || lower.includes("connection")) {
      return {
        title: "Connection Timeout",
        desc: "A temporary network timeout occurred while securely communicating with the payment gateway.",
        tip: "No charges were completed. You can safely try placing your order again.",
      };
    }

    return {
      title: "Payment Processing Failed",
      desc: reason,
      tip: "Please check your payment details or try an alternative card or digital wallet (Apple Pay / Google Pay).",
    };
  };

  const reasonInfo = getReadableReason(rawReason);

  // Attempt to fetch order context if orderId was provided
  useEffect(() => {
    if (!orderId) {
      setLoadingOrder(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/verify?orderId=${encodeURIComponent(orderId)}`);
        const json = await res.json();
        if (json.success && json.order) {
          setOrderInfo(json.order);
        }
      } catch (err) {
        console.warn("Could not load order intent info", err);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleRetryPayment = () => {
    setIsRetrying(true);
    router.push("/checkout");
  };

  const displayItems = orderInfo?.items && orderInfo.items.length > 0
    ? orderInfo.items
    : cartItems.map((ci) => ({
        id: ci.id,
        name: ci.product.name,
        image: ci.product.images?.[0] || ci.product.image || "/product-placeholder.svg",
        unitPrice: ci.unitPrice,
        quantity: ci.quantity,
        variantName: ci.variantName,
      }));

  const displaySubtotal = orderInfo?.subtotal ?? cartSubtotal;
  const displayShippingFee = orderInfo?.shippingFee ?? cartShippingFee;
  const displayTotal = orderInfo?.totalAmount ?? (cartTotal > 0 ? cartTotal : displaySubtotal + displayShippingFee);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn">

      {/* Hero Section: Empathetic Big Message */}
      <div className="text-center py-4 sm:py-6 space-y-3">
        <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <XCircle className="h-9 w-9 text-red-600" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#6b1e30] tracking-tight">
          Sorry, We Couldn&apos;t Receive Your Payment
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your card was not charged and your gourmet selection is still safely saved in your shopping bag.
        </p>

        {orderInfo?.orderNumber && (
          <div className="text-xs text-stone-400 font-mono pt-1">
            Order Ref #{orderInfo.orderNumber}
          </div>
        )}
      </div>

      {/* Main Full-Width 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Payment Reason, Delivery Details & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Payment Status & Failure Reason Card */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-base font-bold text-[#6b1e30] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" /> Payment Status
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                Declined
              </span>
            </div>

            <div className="text-xs space-y-2 text-stone-700">
              <p className="font-bold text-stone-900 text-sm">{reasonInfo.title}</p>
              <p className="text-stone-600 leading-relaxed">{reasonInfo.desc}</p>
              
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-lg p-3 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Recommended Solution:</span>
                </p>
                <p className="leading-relaxed">{reasonInfo.tip}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address Card (If available from order intent) */}
          {orderInfo?.customer && (
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif text-base font-bold text-[#07402b] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6b1e30]" /> Delivery Address
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Express Delivery
                </span>
              </div>

              <div className="text-xs space-y-1 text-stone-700">
                <p className="font-bold text-stone-900 text-sm">{orderInfo.customer.fullName}</p>
                <p className="text-stone-600">{orderInfo.customer.address}</p>
                <p className="text-stone-600">
                  {orderInfo.customer.city}, {orderInfo.customer.state} {orderInfo.customer.postcode}, Australia
                </p>
                {orderInfo.customer.phone && (
                  <p className="text-stone-500 font-mono pt-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-stone-400" /> {orderInfo.customer.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons (Matching Thank You Page structure) */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#E3A72B] hover:bg-[#d49924] text-[#07402b] text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg shadow-2xs hover:shadow-xs transition-all text-center min-h-[44px] cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <RotateCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
              <span>{isRetrying ? "Returning to Checkout..." : "Try Payment Again"}</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cart"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg shadow-2xs hover:shadow-xs transition-all text-center min-h-[44px]"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Return to Cart
              </Link>
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-stone-300 hover:border-[#07402b] text-stone-700 hover:text-[#07402b] text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg transition-all text-center min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Items & Total Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/80 p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#07402b]">
              Items in Cart ({displayItems.length})
            </h3>
            <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded">
              Saved in Bag
            </span>
          </div>

          {/* Items List */}
          {displayItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              No items in bag. You can browse our freshly baked pies in the menu.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {displayItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center justify-between gap-3 text-xs p-3 rounded-lg bg-stone-50/80 border border-stone-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-[#faf6f0] shrink-0 border border-stone-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-stone-100 text-stone-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <p className="font-serif font-bold text-stone-900 truncate text-xs sm:text-sm">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#6b1e30] bg-white px-1.5 py-0.2 rounded border border-stone-200">
                          {item.quantity}x
                        </span>
                        {item.variantName && (
                          <span className="text-[10px] text-[#07402b] font-medium bg-[#07402b]/10 px-1.5 py-0.2 rounded">
                            {item.variantName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold font-mono text-stone-900 text-xs sm:text-sm block">
                      A${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[9px] font-mono text-stone-400">
                      A${item.unitPrice.toFixed(2)}/ea
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Financial Totals */}
          <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-700">
            <div className="flex justify-between">
              <span className="text-stone-500">Items Subtotal</span>
              <span className="font-mono font-bold text-stone-900">A${displaySubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-500">Express Delivery</span>
              {displayShippingFee === 0 ? (
                <span className="font-bold font-sans text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase">
                  FREE
                </span>
              ) : (
                <span className="font-mono font-bold text-stone-900">A${displayShippingFee.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Taxes</span>
              <span className="font-medium">Included</span>
            </div>

            {/* Total Highlight */}
            <div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-xs">Total Due</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[#6b1e30]">
                A${displayTotal.toFixed(2)} AUD
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <PageLayout title="Payment Unsuccessful | Flavour & Co." hideHeader fullWidth>
      <div className="bg-[#fdfbf7] text-stone-800 min-h-screen pb-16 pt-4 sm:pt-8 px-4 sm:px-8 lg:px-12 xl:px-16 font-sans">
        <Suspense
          fallback={
            <div className="bg-[#fcfaf7] min-h-[60vh] flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6b1e30] border-t-transparent" />
              <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-widest">
                Loading payment status...
              </span>
            </div>
          }
        >
          <FailedContent />
        </Suspense>
      </div>
    </PageLayout>
  );
}
