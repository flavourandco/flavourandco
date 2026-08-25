"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  MapPin,
  ShoppingBag,
  ExternalLink,
  RotateCw,
  Phone,
  User,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

interface OrderDetails {
  id: string;
  orderNumber: string;
  paymentStatus: "paid" | "pending" | "failed" | "canceled";
  status: string;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  squarePaymentId?: string;
  squareReceiptUrl?: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
  };
  items: Array<{
    id: string;
    name: string;
    image: string;
    unitPrice: number;
    quantity: number;
    variantName?: string;
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const fetchOrderStatus = async () => {
    if (!orderId) {
      setError("No order identifier was found in URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/orders/verify?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to retrieve order details.");
      }

      setOrder(data.order);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Could not load order status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
  }, [orderId]);

  // Real-time Webhook Status Polling: If payment is pending, poll status up to 8 times
  useEffect(() => {
    if (order && order.paymentStatus === "pending" && pollCount < 8) {
      const timer = setTimeout(() => {
        setPollCount((prev) => prev + 1);
        fetchOrderStatus();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [order, pollCount]);

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6b1e30] border-t-transparent" />
        <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-widest text-center">
          Verifying payment details...
        </span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg text-center py-12 px-5 bg-white rounded-xl border border-stone-200 shadow-md my-8 space-y-4">
        <div className="h-14 w-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-200">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Order Verification Issue</h2>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          {error || "We could not find the specified order."}
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg inline-block transition-all shadow-xs"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  // PENDING WEBHOOK STATE
  if (order.paymentStatus === "pending") {
    return (
      <div className="mx-auto max-w-xl bg-white rounded-xl border border-[#c69c40]/30 p-6 sm:p-10 shadow-lg text-center my-6 space-y-5">
        <div className="h-14 w-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
          <RotateCw className="h-7 w-7 animate-spin" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c69c40] font-bold">
            Order #{order.orderNumber}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#07402b]">
            Processing Payment Confirmation...
          </h2>
          <p className="text-stone-600 text-xs max-w-sm mx-auto leading-relaxed">
            Your payment request has been received. We are receiving authoritative confirmation. This page updates automatically.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              setLoading(true);
              fetchOrderStatus();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-md transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" /> Check Status Now
          </button>
        </div>
      </div>
    );
  }

  // FAILED / CANCELED STATE
  if (order.paymentStatus === "failed" || order.paymentStatus === "canceled") {
    return (
      <div className="mx-auto max-w-md text-center py-12 px-6 bg-white rounded-xl border border-red-200 shadow-md my-8 space-y-4">
        <div className="h-14 w-14 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 border border-red-200">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-900">Payment Not Completed</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Your payment attempt was not completed. Order #{order.orderNumber} remains pending.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/checkout"
            className="w-full sm:w-auto bg-[#6b1e30] hover:bg-[#07402b] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg shadow-sm transition-all"
          >
            Retry Payment
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-stone-200 transition-all"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  // COMPLETED / PAID MINIMAL FULL-WIDTH LUXURY CONFIRMATION
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn">

      {/* Hero Section: Big Thank You Message */}
      <div className="text-center py-4 sm:py-6 space-y-3">
        <div className="h-16 w-16 mx-auto rounded-full bg-[#07402b]/10 flex items-center justify-center text-[#07402b]">
          <CheckCircle2 className="h-9 w-9 text-[#07402b]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#6b1e30] tracking-tight">
          Thank You For Your Order!
        </h1>
        <div className="text-xs text-stone-400 font-mono pt-1">
          Order #{order.orderNumber}
        </div>
      </div>

      {/* Main Full-Width 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Delivery Details & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Delivery Address Card */}
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
              <p className="font-bold text-stone-900 text-sm">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.address}</p>
              <p className="text-stone-600">
                {order.customer.city}, {order.customer.state} {order.customer.postcode}, Australia
              </p>
              {order.customer.phone && (
                <p className="text-stone-500 font-mono pt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-stone-400" /> {order.customer.phone}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/profile"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg shadow-2xs hover:shadow-xs transition-all text-center min-h-[44px]"
            >
              <User className="w-3.5 h-3.5" /> View Order in Profile
            </Link>
            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-stone-300 hover:border-[#07402b] text-stone-700 hover:text-[#07402b] text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg transition-all text-center min-h-[44px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN: Items & Payment Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/80 p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#07402b]">
              Items Ordered ({order.items.length})
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              Paid AUD
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {order.items.map((item, idx) => (
              <div
                key={idx}
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

          {/* Financial Totals */}
          <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-700">
            <div className="flex justify-between">
              <span className="text-stone-500">Items Subtotal</span>
              <span className="font-mono font-bold text-stone-900">A${order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-500">Express Delivery</span>
              {order.shippingFee === 0 ? (
                <span className="font-bold font-sans text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase">
                  FREE
                </span>
              ) : (
                <span className="font-mono font-bold text-stone-900">A${order.shippingFee.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between text-[10px] text-stone-400">
              <span>GST (10% Included)</span>
              <span className="font-mono">A${((order.totalAmount * 10) / 110).toFixed(2)}</span>
            </div>

            {/* Total Highlight */}
            <div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-xs">Total Paid</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[#6b1e30]">
                A${order.totalAmount.toFixed(2)} AUD
              </span>
            </div>

            {order.squareReceiptUrl && (
              <div className="pt-2 text-right">
                <a
                  href={order.squareReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#07402b] hover:text-[#6b1e30] transition-colors"
                >
                  <span>View Official Digital Receipt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <PageLayout title="Order Confirmation" hideHeader fullWidth>
      <div className="bg-[#fdfbf7] text-stone-800 min-h-screen pb-16 pt-4 sm:pt-8 px-4 sm:px-8 lg:px-12 xl:px-16 font-sans">
        <Suspense
          fallback={
            <div className="bg-[#fcfaf7] min-h-[60vh] flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6b1e30] border-t-transparent" />
              <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-widest">
                Loading order receipt...
              </span>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </PageLayout>
  );
}
