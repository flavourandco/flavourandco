"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useFreeDeliveryThreshold } from "@/hooks/useFreeDeliveryThreshold";
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
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Gift,
  HelpCircle,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import SquarePaymentForm from "@/components/checkout/SquarePaymentForm";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import {
  isFreeDeliveryPostcode,
  isSydney50KmPostcode,
  getDeliveryQuote,
  calculateShippingFee,
  isValidAustralianPostcode,
  AUSTRALIAN_STATES,
} from "@/lib/shipping";

const QUICK_DELIVERY_PREFERENCES = [
  "Leave at front door",
  "Ring doorbell upon delivery",
  "Leave in a shaded/safe spot",
  "Call before arrival",
];

function StateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (stateCode: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedState = AUSTRALIAN_STATES.find((st) => st.code === value) || AUSTRALIAN_STATES[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-md border border-stone-200/90 bg-stone-50/40 px-3 py-3 text-stone-800 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all cursor-pointer font-bold text-xs min-h-[44px]"
      >
        <span>{selectedState.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 left-0 bg-white rounded-md border border-stone-200/90 shadow-xl py-1 max-h-60 overflow-y-auto text-xs animate-fadeIn">
          {AUSTRALIAN_STATES.map((st) => {
            const isSelected = st.code === value;
            return (
              <button
                key={st.code}
                type="button"
                onClick={() => {
                  onChange(st.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer min-h-[40px] ${
                  isSelected
                    ? "bg-[#07402b]/10 text-[#07402b] font-bold"
                    : "text-stone-700 hover:bg-stone-50 hover:text-[#6b1e30]"
                }`}
              >
                <span>
                  <strong>{st.code}</strong> - {st.name}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#07402b]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const addToast = useUIStore((s) => s.addToast);
  const freeDeliveryThreshold = useFreeDeliveryThreshold();

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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6b1e30] border-t-transparent" />
          <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-widest">
            Preparing your secure checkout...
          </span>
        </div>
      </PageLayout>
    );
  }

  const subtotal = getSubtotal();
  const deliveryQuote = getDeliveryQuote(subtotal, formData.postcode, freeDeliveryThreshold);
  const isPostcodeFilled = formData.postcode.trim().length === 4;
  const isDeliverable = !isPostcodeFilled || deliveryQuote.isDeliverable;
  const shippingFee = deliveryQuote.isDeliverable ? deliveryQuote.fee : 15;
  const total = subtotal + shippingFee;

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
    if (!isSydney50KmPostcode(formData.postcode)) {
      addToast(
        `Delivery is currently only available within Greater Sydney (up to 50km). Postcode ${formData.postcode} is outside our delivery zone.`,
        "error"
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Phase 1: Create Server-Authoritative Pending Order Intent
      const intentRes = await fetch("/api/checkout/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
        }),
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok || !intentData.success) {
        throw new Error(intentData.error || "Failed to create order intent. Please try again.");
      }

      // Phase 2: Execute Payment Call with Server-Validated Order & Persistent Idempotency Key
      const payRes = await fetch("/api/checkout/square", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: intentData.orderId,
          idempotencyKey: intentData.idempotencyKey,
          sourceId,
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok || !payData.success) {
        throw new Error(payData.error || "Payment processing failed. Please check card details.");
      }

      // Clear local shopping cart and navigate to authoritative success page
      clearCart();
      addToast("Order placed successfully! Thank you for ordering with Flavour & Co.", "success");
      router.push(`/checkout/success?orderId=${encodeURIComponent(payData.orderId)}`);
    } catch (err: any) {
      addToast(err.message || "Checkout failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout title="Checkout" hideHeader fullWidth>
      <div className="bg-[#fdfbf7] text-stone-800 min-h-screen pb-20 pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-6xl">

          {/* TOP STEP NAVIGATION & BRAND ACCENT */}
          <div className="mb-6 pb-4 border-b border-[#c69c40]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#6b1e30] transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Return to Shopping Cart</span>
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#07402b] tracking-tight">
                Secure Checkout
              </h1>
            </div>

            {/* Stepper Pill */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 bg-white px-3.5 py-2 rounded-lg border border-[#c69c40]/20 shadow-2xs self-start sm:self-auto">
              <span className="text-[#07402b] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#07402b]" /> Cart
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-[#6b1e30] font-bold">Delivery &amp; Payment</span>
            </div>
          </div>

          {items.length === 0 ? (
            /* EMPTY CHECKOUT REDIRECT */
            <div className="mx-auto max-w-xl text-center py-16 bg-white rounded-xl border border-stone-200 p-8 shadow-sm my-8 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-lg bg-[#faf6f0] flex items-center justify-center text-stone-400">
                <ShoppingBag className="h-8 w-8 text-stone-400 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1e30]">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Add our signature buttery pastries and artisanal gourmet pies to your cart before proceeding to checkout.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg inline-block transition-all shadow-xs"
                >
                  Explore Menu
                </Link>
              </div>
            </div>
          ) : (
            /* CHECKOUT MAIN CONTENT GRID */
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-start">

              {/* MOBILE ORDER SUMMARY TOGGLE (Visible on small screens < 1024px) */}
              <div className="lg:hidden bg-white rounded-xl border border-[#c69c40]/30 p-4 shadow-sm space-y-3">
                <button
                  type="button"
                  onClick={() => setShowMobileSummary((prev) => !prev)}
                  className="w-full flex items-center justify-between text-xs font-bold text-stone-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#6b1e30]" />
                    <span>Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#6b1e30]">A${total.toFixed(2)} AUD</span>
                    {showMobileSummary ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </div>
                </button>

                {showMobileSummary && (
                  <div className="pt-3 border-t border-stone-100 space-y-3 animate-fadeIn">
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded bg-stone-50">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-bold text-[#6b1e30] bg-white px-1.5 py-0.5 rounded text-[10px] border border-stone-200">
                              {item.quantity}x
                            </span>
                            <span className="font-serif font-medium truncate">{item.product.name}</span>
                          </div>
                          <span className="font-mono font-bold">A${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs space-y-1 text-stone-600 pt-1 border-t border-stone-100">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">A${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span className="font-mono">{shippingFee === 0 ? "FREE" : `A$${shippingFee.toFixed(2)}`}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* LEFT COLUMN: CUSTOMER DETAILS & PAYMENT (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">

                {/* Section 1: Customer Contact & Delivery Info */}
                <div className="bg-white rounded-xl border border-[#c69c40]/25 p-5 sm:p-7 shadow-xs space-y-5">
                  
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                      Contact &amp; Delivery Address
                    </h2>
                    <p className="text-[11px] text-stone-500 mt-0.5">Enter where we should deliver your pie order.</p>
                  </div>

                  {/* Form Inputs Grid */}
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
                          placeholder="Full name"
                          className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all min-h-[44px]"
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
                          placeholder="Email address"
                          className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all min-h-[44px]"
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
                          className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all min-h-[44px]"
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
                          placeholder="Street address"
                          className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 pl-10 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all min-h-[44px]"
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
                        placeholder="Suburb or City"
                        className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all min-h-[44px]"
                      />
                    </div>

                    {/* State & Postcode Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold uppercase tracking-wider text-stone-700 text-[11px] block">
                          State <span className="text-[#6b1e30]">*</span>
                        </label>
                        <StateSelector
                          value={formData.state}
                          onChange={(st) => setFormData({ ...formData, state: st })}
                        />
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
                          placeholder="Postcode"
                          className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all font-mono min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Dynamic 3-Tier Delivery Feedback Banner */}
                    {isPostcodeFilled && (
                      <div className="sm:col-span-2">
                        {!deliveryQuote.isDeliverable ? (
                          <div className="p-3.5 bg-amber-50 rounded-md border border-amber-300 text-amber-900 flex items-start gap-2.5 animate-fadeIn">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5 text-xs">
                              <p className="font-bold text-amber-950">
                                Delivery Currently Not Available for {formData.postcode.trim()}
                              </p>
                              <p className="text-[11px] text-amber-800 leading-relaxed">
                                We currently deliver fresh &amp; frozen gourmet orders across <strong>Greater Sydney (within ~50km)</strong>. Please contact us for bulk or special arrangements.
                              </p>
                            </div>
                          </div>
                        ) : deliveryQuote.isFree ? (
                          <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-[#07402b] flex items-center justify-between gap-2 animate-fadeIn">
                            <span className="text-xs font-bold">
                              {deliveryQuote.tier === 1
                                ? "Free Local Delivery applied!"
                                : "Free Express Delivery applied!"}
                            </span>
                            <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-md shrink-0">
                              A$0.00 Delivery
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-stone-50 rounded-md border border-stone-200 text-stone-700 flex items-center justify-between gap-2 animate-fadeIn">
                            <div className="flex items-center gap-2 text-xs">
                              <Truck className="w-4 h-4 text-[#07402b] shrink-0" />
                              <span>
                                <strong>Standard Sydney Delivery:</strong> A$15.00
                                {freeDeliveryThreshold - subtotal > 0 && (
                                  <span className="text-stone-500 ml-1">
                                    (Add A${(freeDeliveryThreshold - subtotal).toFixed(2)} more for Free Delivery)
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded-md shrink-0 font-mono">
                              A$15.00
                            </span>
                          </div>
                        )}
                      </div>
                    )}


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
                            className="text-[10px] font-medium bg-stone-100 hover:bg-[#c69c40]/15 text-stone-700 hover:text-[#6b1e30] px-2.5 py-1.5 rounded-md border border-stone-200/80 transition-colors cursor-pointer"
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
                        placeholder="Leave at door, gate code, or delivery instructions..."
                        className="w-full rounded-md border border-stone-200/90 bg-stone-50/40 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#6b1e30] focus:ring-2 focus:ring-[#6b1e30]/10 focus:outline-none transition-all"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 2: Secure Payment Form */}
                <div className="bg-white rounded-sm border border-[#c69c40]/25 p-3.5 sm:p-7 shadow-xs space-y-4 w-full">
                  <div className="pb-3 border-b border-stone-100">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                      Payment Method
                    </h2>
                  </div>

                  {/* Embedded Payment Form Component */}
                  <SquarePaymentForm
                    onSubmitPayment={handleProcessPayment}
                    onCancel={() => router.push("/cart")}
                    isProcessing={isProcessing}
                    totalAmount={total}
                    postcode={formData.postcode}
                    addressSummary={
                      formData.address
                        ? `${formData.address}${formData.city ? `, ${formData.city}` : ""} ${formData.state} ${formData.postcode}`.trim()
                        : undefined
                    }
                  />
                </div>

              </div>

              {/* RIGHT COLUMN: LUXURY STICKY ORDER SUMMARY (5 COLS - Desktop Only) */}
              <div className="lg:col-span-5 lg:sticky lg:top-[120px] self-start space-y-4">
                
                {/* Luxury Receipt Card */}
                <div className="bg-white rounded-xl border border-[#c69c40]/30 p-5 sm:p-6 shadow-md space-y-4 relative overflow-hidden">
                  
                  {/* Top Decorative Accent */}
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
                    <span className="text-xs font-mono font-extrabold text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-0.5 rounded-md">
                      {items.length} {items.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 text-xs p-2.5 rounded-md bg-stone-50/70 border border-stone-100">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-[#faf6f0] shrink-0 border border-[#c69c40]/25 mt-0.5">
                          <Image
                            src={item.product.images?.[0] || item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className="font-serif font-bold text-stone-900 truncate text-xs sm:text-sm">
                            {item.product.name}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[9px] font-bold text-[#6b1e30] bg-white px-1.5 py-0.2 rounded border border-stone-200">
                              {item.quantity}x
                            </span>
                            {item.variantName && (
                              <span className="text-[9px] text-[#07402b] font-semibold bg-[#07402b]/10 px-1.5 py-0.2 rounded">
                                {item.variantName}
                              </span>
                            )}
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
                        <span className="font-extrabold font-sans text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
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
                        <span className="text-[11px] text-stone-400 font-medium">All taxes included</span>
                      </div>
                      <span className="font-mono text-xl font-black text-[#6b1e30]">
                        A${total.toFixed(2)} <span className="text-xs font-sans font-bold text-stone-600">AUD</span>
                      </span>
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
