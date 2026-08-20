"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ShoppingBag,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Sparkles,
  Flame,
  Clock,
  ChevronRight,
  Gift,
  HelpCircle,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import SquarePaymentForm from "@/components/checkout/SquarePaymentForm";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import {
  isFreeDeliveryPostcode,
  calculateShippingFee,
  isValidAustralianPostcode,
  AUSTRALIAN_STATES,
} from "@/lib/shipping";

interface OrderSuccessData {
  orderId: string;
  paymentId: string;
  dbId?: string;
  totalAmount: number;
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
    product: { name: string; image: string };
    unitPrice: number;
    quantity: number;
    variantName?: string;
  }>;
}

const QUICK_DELIVERY_PREFERENCES = [
  "Leave at front door",
  "Ring doorbell upon delivery",
  "Leave in a shaded/safe spot",
  "Call before arrival",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const addToast = useUIStore((s) => s.addToast);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    unit: "",
    city: "",
    state: "NSW",
    postcode: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prev.email || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  if (!mounted) {
    return (
      <PageLayout title="Checkout" hideHeader fullWidth>
        <div className="bg-[#fcfaf7] min-h-[75vh] flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#6b1e30] border-t-transparent" />
          <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-widest">
            Preparing your secure checkout...
          </span>
        </div>
      </PageLayout>
    );
  }

  const subtotal = getSubtotal();
  const isEligibleForFreeShipping = isFreeDeliveryPostcode(formData.postcode) || subtotal >= 200;
  const shippingFee = calculateShippingFee(subtotal, formData.postcode);
  const total = subtotal + shippingFee;
  const isPostcodeFilled = formData.postcode.trim().length === 4;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectQuickNote = (note: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}, ${note}` : note,
    }));
  };

  const handleProcessPayment = async (sourceId: string) => {
    if (!formData.fullName.trim()) {
      addToast("Please enter your full name.", "error");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      addToast("Please enter a valid email address.", "error");
      return;
    }
    if (!formData.phone.trim()) {
      addToast("Please enter a contact phone number.", "error");
      return;
    }
    if (!formData.address.trim()) {
      addToast("Please enter your delivery street address.", "error");
      return;
    }
    if (!formData.city.trim()) {
      addToast("Please enter your city / suburb.", "error");
      return;
    }
    if (!isValidAustralianPostcode(formData.postcode)) {
      addToast("Please enter a valid 4-digit Australian postcode.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/checkout/square", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          sourceId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Payment processing failed. Please check card details.");
      }

      setOrderSuccess(data);
      clearCart();
      addToast("Order placed successfully! Thank you for ordering with Flavour & Co.", "success");
    } catch (err: any) {
      addToast(err.message || "Checkout failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout title="Checkout" hideHeader fullWidth>
      <div className="bg-[#fdfbf7] text-stone-800 min-h-screen pb-20 pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-6xl">

          {/* TOP STEP NAVIGATION & BRAND ACCENT */}
          <div className="mb-8 pb-6 border-b border-[#c69c40]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#6b1e30] transition-colors group mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Return to Shopping Cart</span>
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#07402b] tracking-tight">
                Secure Checkout
              </h1>
            </div>

            {/* Stepper Pill */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 bg-white px-4 py-2 rounded-full border border-[#c69c40]/20 shadow-2xs">
              <span className="text-[#07402b] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#07402b]" /> Cart
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-[#6b1e30] font-bold">Delivery &amp; Payment</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-400">Confirmation</span>
            </div>
          </div>

          {/* IF ORDER SUCCESSFUL: LUXURY RECEIPT VIEW */}
          {orderSuccess ? (
            <div className="mx-auto max-w-3xl bg-white rounded-3xl border border-[#c69c40]/35 p-6 sm:p-12 shadow-xl space-y-8 text-center my-6 animate-fadeIn">
              <div className="h-20 w-20 mx-auto rounded-full bg-[#07402b]/10 flex items-center justify-center text-[#07402b] border border-[#07402b]/20 shadow-xs">
                <CheckCircle2 className="h-10 w-10 text-[#07402b]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#c69c40] font-extrabold">
                  Order Confirmed • #{orderSuccess.orderId}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6b1e30]">
                  Thank You For Your Order!
                </h2>
                <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
                  Your order has been recorded and a receipt was sent to <strong>{orderSuccess.customer.email}</strong>. Our kitchen will freshly handcraft and prepare your shipment.
                </p>
              </div>

              {/* Order Details Breakdown */}
              <div className="bg-[#faf6f0] rounded-2xl border border-[#c69c40]/25 p-6 text-left space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 text-xs font-bold uppercase tracking-wider text-[#07402b]">
                  <span>Items Ordered ({orderSuccess.items.length})</span>
                  <span>Total</span>
                </div>

                <div className="space-y-3">
                  {orderSuccess.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm text-stone-800">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#6b1e30] bg-white px-2 py-0.5 rounded border border-stone-200 text-xs">
                          {item.quantity}x
                        </span>
                        <span className="font-serif font-semibold">
                          {item.product.name} {item.variantName ? `(${item.variantName})` : ""}
                        </span>
                      </div>
                      <span className="font-bold font-mono text-sm">
                        A${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200/80 pt-3 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-stone-900">Card Payment (Square Encrypted)</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#6b1e30] pt-2 border-t border-stone-200/60">
                    <span>Grand Total Paid:</span>
                    <span className="font-mono text-lg">A${orderSuccess.totalAmount.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Summary */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 shadow-2xs">
                <span className="font-bold uppercase tracking-wider text-[#07402b] block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#6b1e30]" /> Delivery Address
                </span>
                <p className="font-bold text-stone-900 text-sm">{orderSuccess.customer.fullName}</p>
                <p className="text-stone-600">{orderSuccess.customer.address}</p>
                <p className="text-stone-600">
                  {orderSuccess.customer.city}, {orderSuccess.customer.state} {orderSuccess.customer.postcode}, Australia
                </p>
                <p className="text-stone-500 font-mono pt-1">Contact: {orderSuccess.customer.phone}</p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  View Order in Profile
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white border border-stone-300 text-stone-700 hover:border-[#07402b] hover:text-[#07402b] text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all cursor-pointer"
                >
                  Explore More Handcrafted Pies
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* EMPTY CHECKOUT REDIRECT */
            <div className="mx-auto max-w-xl text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm my-8 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#faf6f0] flex items-center justify-center text-stone-400">
                <ShoppingBag className="h-8 w-8 text-stone-400 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1e30]">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Add our signature buttery pastries and artisanal gourmet pies to your cart before proceeding to checkout.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full inline-block transition-all shadow-xs"
                >
                  Explore Menu
                </Link>
              </div>
            </div>
          ) : (
            /* ONE-PAGE CHECKOUT MAIN CONTENT GRID */
            <div className="grid gap-8 lg:grid-cols-12 items-start">

              {/* LEFT COLUMN: CUSTOMER DETAILS & PAYMENT (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">

                {/* Section 1: Customer Contact & Delivery Info */}
                <div className="bg-white rounded-3xl border border-[#c69c40]/25 p-6 sm:p-8 shadow-xs space-y-6">
                  
                  {/* Section Title */}
                  <div className="pb-4 border-b border-stone-100">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                      Contact &amp; Delivery Address
                    </h2>
                    <p className="text-[11px] text-stone-500 mt-0.5">Enter where we should deliver your pie order.</p>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

                    {/* Full Name */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                        Full Name <span className="text-[#6b1e30]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Simran Gulati"
                          className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                        />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                        Email Address <span className="text-[#6b1e30]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                        Phone Number <span className="text-[#6b1e30]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0400 000 000"
                          className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                        />
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                        Delivery Street Address <span className="text-[#6b1e30]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="e.g. 100 George Street"
                          className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                        />
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Suburb / City */}
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                        City / Suburb <span className="text-[#6b1e30]">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Sydney, Parramatta, Melbourne"
                        className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                      />
                    </div>

                    {/* State & Postcode */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                          State <span className="text-[#6b1e30]">*</span>
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-3 py-3 text-stone-800 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all cursor-pointer font-medium"
                        >
                          {AUSTRALIAN_STATES.map((st) => (
                            <option key={st.code} value={st.code}>
                              {st.code} ({st.name})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                          Postcode <span className="text-[#6b1e30]">*</span>
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          required
                          maxLength={4}
                          value={formData.postcode}
                          onChange={handleInputChange}
                          placeholder="e.g. 2000"
                          className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Dynamic Free Shipping Postcode Feedback Banner */}
                    <div className="sm:col-span-2">
                      {isPostcodeFilled && isEligibleForFreeShipping ? (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[#07402b] flex items-center justify-between gap-2 animate-fadeIn">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              <strong>Free Express Delivery applied!</strong> Eligible for postcode {formData.postcode.trim()}.
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full shrink-0">
                            A$0.00 Delivery
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 flex items-center gap-2 text-[11px]">
                          <Truck className="w-4 h-4 text-[#07402b] shrink-0" />
                          <span>
                            Direct delivery across Australia. Temperature-controlled packaging ensures peak freshness.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Special Delivery Notes */}
                    <div className="sm:col-span-2 space-y-2 pt-1">
                      <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                        Delivery Instructions (Optional)
                      </label>
                      
                      {/* Quick Select Pill Buttons */}
                      <div className="flex flex-wrap gap-1.5 pb-1">
                        {QUICK_DELIVERY_PREFERENCES.map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleSelectQuickNote(pref)}
                            className="text-[10px] font-medium bg-stone-100 hover:bg-[#c69c40]/15 text-stone-700 hover:text-[#6b1e30] px-2.5 py-1 rounded-full border border-stone-200/80 transition-colors cursor-pointer"
                          >
                            + {pref}
                          </button>
                        ))}
                      </div>

                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Leave near front door inside gate, or call on arrival."
                        className="w-full rounded-xl border border-stone-200/90 bg-stone-50/40 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 2: Secure Square Payment Form */}
                <div className="bg-white rounded-3xl border border-[#c69c40]/25 p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                        Payment Method
                      </h2>
                      <p className="text-[11px] text-stone-500 mt-0.5">256-Bit SSL Encrypted &amp; Verified by Square Payments</p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <Lock className="w-3 h-3" /> PCI-DSS Compliant
                    </span>
                  </div>

                  {/* Embedded Payment Form Component */}
                  <SquarePaymentForm
                    onSubmitPayment={handleProcessPayment}
                    onCancel={() => router.push("/cart")}
                    isProcessing={isProcessing}
                    totalAmount={total}
                  />
                </div>

              </div>

              {/* RIGHT COLUMN: LUXURY STICKY ORDER SUMMARY (5 COLS) */}
              <div className="lg:col-span-5 lg:sticky lg:top-[132px] self-start space-y-4">
                
                {/* Luxury Receipt Card */}
                <div className="bg-white rounded-3xl border border-[#c69c40]/30 p-5 sm:p-6 shadow-md space-y-4 relative overflow-hidden">
                  
                  {/* Top Decorative Gold Foil Header Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#07402b] via-[#c69c40] to-[#6b1e30]" />

                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c69c40] font-bold block">
                        Artisanal Bakery Selection
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                        Order Summary
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-0.5 rounded-full">
                      {items.length} {items.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-xs p-2 rounded-xl bg-stone-50/60 border border-stone-100 hover:bg-stone-50 transition-colors">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-[#faf6f0] shrink-0 border border-[#c69c40]/25 shadow-2xs">
                          <Image
                            src={item.product.images?.[0] || item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-stone-900 truncate text-xs sm:text-sm">
                            {item.product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-semibold text-stone-500 bg-white px-1.5 py-0.2 rounded border border-stone-200">
                              {item.quantity}x
                            </span>
                            {item.variantName && (
                              <span className="text-[9px] text-[#07402b] font-medium truncate">
                                {item.variantName}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold font-mono text-stone-900 text-xs sm:text-sm shrink-0">
                          A${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Totals Breakdown */}
                  <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Items Subtotal</span>
                      <span className="font-bold font-mono text-stone-900">A${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-500">Express Delivery</span>
                        <Truck className="w-3.5 h-3.5 text-[#07402b]" />
                      </div>
                      {shippingFee === 0 ? (
                        <span className="font-extrabold font-sans text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                          FREE
                        </span>
                      ) : (
                        <span className="font-bold font-mono text-stone-900">A${shippingFee.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>GST (10% Included)</span>
                      <span className="font-mono">A${((total * 10) / 110).toFixed(2)}</span>
                    </div>

                    {/* Total Highlight */}
                    <div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Total Due</span>
                        <span className="text-[11px] text-stone-400 font-medium">All taxes &amp; charges included</span>
                      </div>
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#6b1e30]">
                        A${total.toFixed(2)} <span className="text-xs font-sans font-bold text-stone-600">AUD</span>
                      </span>
                    </div>
                  </div>

                  {/* Trust Footer Highlights */}
                  <div className="bg-[#faf6f0] p-3 rounded-2xl border border-[#c69c40]/25 space-y-1.5 text-[10px] text-stone-700">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-[#07402b] shrink-0" />
                      <span><strong>Direct Cold-Chain Delivery</strong> across Australia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-[#6b1e30] shrink-0" />
                      <span><strong>Oven &amp; Air Fryer Ready</strong> in minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#c69c40] shrink-0" />
                      <span><strong>100% Satisfaction &amp; Quality</strong> Guarantee</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
}
