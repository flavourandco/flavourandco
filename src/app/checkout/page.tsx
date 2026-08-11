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
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import SquarePaymentForm from "@/components/checkout/SquarePaymentForm";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShippingFee = useCartStore((s) => s.getShippingFee);
  const getTotal = useCartStore((s) => s.getTotal);

  const addToast = useUIStore((s) => s.addToast);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    unit: "",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
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
        <div className="bg-[#fcf9f4] min-h-[70vh] flex items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#6b1e30] border-t-transparent" />
        </div>
      </PageLayout>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      addToast("Please enter your street address.", "error");
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
        throw new Error(data.error || "Payment processing failed.");
      }

      setOrderSuccess(data);
      clearCart();
      addToast("Order placed successfully!", "success");
    } catch (err: any) {
      addToast(err.message || "Checkout failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout title="Checkout" hideHeader fullWidth>
      <div className="bg-[#fcf9f4] text-stone-800 min-h-screen pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* IF ORDER SUCCESSFUL: SHOW RECEIPT VIEW */}
          {orderSuccess ? (
            <div className="mx-auto max-w-3xl bg-white rounded-2xl border border-[#c69c40]/30 p-6 sm:p-10 shadow-xl space-y-8 text-center my-6">
              <div className="h-20 w-20 mx-auto rounded-full bg-[#07402b]/10 flex items-center justify-center text-[#07402b]">
                <CheckCircle2 className="h-10 w-10 text-[#07402b]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c69c40] font-extrabold">
                  Order Confirmed • Receipt #{orderSuccess.orderId}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6b1e30]">
                  Thank you for your order!
                </h2>
                <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
                  We&apos;ve saved your order in our database and sent a confirmation email to <strong>{orderSuccess.customer.email}</strong>. Your handcrafted pies will be dispatched with cold-chain insulation shortly.
                </p>
              </div>

              {/* Order Details Breakdown */}
              <div className="bg-[#faf6f0] rounded-xl border border-[#c69c40]/20 p-5 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 text-xs font-bold uppercase tracking-wider text-[#07402b]">
                  <span>Items Ordered ({orderSuccess.items.length})</span>
                  <span>Total</span>
                </div>

                <div className="space-y-3">
                  {orderSuccess.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm text-stone-800">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#6b1e30]">{item.quantity}x</span>
                        <span className="font-serif font-medium">{item.product.name} {item.variantName ? `(${item.variantName})` : ""}</span>
                      </div>
                      <span className="font-bold font-sans">A${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200/80 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-bold text-stone-800">Card Payment (ID: {orderSuccess.paymentId.slice(-8)})</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#6b1e30] pt-2 border-t border-stone-200/60">
                    <span>Amount Paid</span>
                    <span>A${orderSuccess.totalAmount.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Summary */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 text-left text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider text-[#07402b] block mb-1">
                  Delivery Address
                </span>
                <p className="font-semibold text-stone-900">{orderSuccess.customer.fullName}</p>
                <p className="text-stone-600">{orderSuccess.customer.address}</p>
                <p className="text-stone-600">
                  {orderSuccess.customer.city}, {orderSuccess.customer.state} {orderSuccess.customer.postcode}
                </p>
                <p className="text-stone-500 pt-1">Phone: {orderSuccess.customer.phone}</p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-[#07402b] hover:bg-[#6b1e30] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg shadow-md transition-all"
                >
                  View My Orders
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white border border-stone-300 text-stone-700 hover:border-[#07402b] text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg transition-all"
                >
                  Explore More Products
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* EMPTY CHECKOUT REDIRECT */
            <div className="mx-auto max-w-xl text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm my-8">
              <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-[#6b1e30] mb-2">Your Shopping Cart is Empty</h2>
              <p className="text-xs text-stone-600 mb-6">Please add gourmet pies to your cart before proceeding to checkout.</p>
              <Link
                href="/shop"
                className="bg-[#6b1e30] hover:bg-[#07402b] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg inline-block transition-colors"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            /* ONE-PAGE CHECKOUT MAIN CONTENT GRID */
            <div className="grid gap-8 lg:grid-cols-12 items-start">

              {/* LEFT COLUMN: CUSTOMER DETAILS & PAYMENT IN ONE CONTINUOUS FLOW */}
              <div className="lg:col-span-7 space-y-6">

                {/* Section 1: Customer Contact & Delivery Info */}
                <div className="bg-white rounded-2xl border border-[#c69c40]/30 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <h2 className="font-serif text-xl font-bold text-[#07402b] flex items-center gap-2.5">
                      <User className="h-5 w-5 text-[#6b1e30]" />
                      <span>Contact &amp; Delivery Information</span>
                    </h2>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

                    {/* Full Name */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 block">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Simran Gulati"
                          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 pl-10 text-stone-800 placeholder:text-stone-400 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 block">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 pl-10 text-stone-800 placeholder:text-stone-400 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 block">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0400 000 000"
                          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 pl-10 text-stone-800 placeholder:text-stone-400 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 block">
                        Delivery Street Address *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="e.g. 100 George Street"
                          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 pl-10 text-stone-800 placeholder:text-stone-400 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {/* Suburb / City */}
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 block">
                        City / Suburb *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Sydney"
                        className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-stone-800 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                      />
                    </div>

                    {/* State & Postcode */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="font-bold uppercase tracking-wider text-stone-700 block">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-800 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none bg-white"
                        >
                          <option value="NSW">NSW</option>
                          <option value="VIC">VIC</option>
                          <option value="QLD">QLD</option>
                          <option value="WA">WA</option>
                          <option value="SA">SA</option>
                          <option value="TAS">TAS</option>
                          <option value="ACT">ACT</option>
                          <option value="NT">NT</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold uppercase tracking-wider text-stone-700 block">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          required
                          value={formData.postcode}
                          onChange={handleInputChange}
                          placeholder="2000"
                          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-stone-800 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Special Delivery Notes */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-stone-700 block">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Leave at front door inside insulated box if not home."
                        className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-stone-800 placeholder:text-stone-400 focus:border-[#6b1e30] focus:ring-1 focus:ring-[#6b1e30] focus:outline-none"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 2: Payment Method */}
                <div className="bg-white rounded-2xl border border-[#c69c40]/30 p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <h2 className="font-serif text-xl font-bold text-[#07402b] flex items-center gap-2.5">
                      <CreditCard className="h-5 w-5 text-[#6b1e30]" />
                      <span>Payment Method</span>
                    </h2>
                  </div>

                  {/* Embedded Payment Form Component with Cancel button */}
                  <SquarePaymentForm
                    onSubmitPayment={handleProcessPayment}
                    onCancel={() => router.push("/cart")}
                    isProcessing={isProcessing}
                    totalAmount={total}
                  />
                </div>

              </div>

              {/* RIGHT COLUMN: STICKY ORDER SUMMARY (LOCKED TO TOP MARGIN ON SCROLL) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6">
                <div className="bg-white rounded-2xl border border-[#c69c40]/30 p-6 shadow-sm space-y-5">
                  <h3 className="font-serif text-xl font-bold text-[#07402b] pb-3 border-b border-stone-100 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-mono font-bold text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-0.5 rounded-full">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </h3>

                  {/* Items Mini List */}
                  <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-xs">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[#faf6f0] shrink-0 border border-stone-200/80">
                          <Image
                            src={item.product.images?.[0] || item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-stone-900 truncate">{item.product.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            {item.quantity}x A${item.unitPrice.toFixed(2)} {item.variantName ? `(${item.variantName})` : ""}
                          </p>
                        </div>
                        <span className="font-bold font-sans text-stone-800">
                          A${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Totals */}
                  <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs text-stone-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold font-sans">A${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      {shippingFee === 0 ? (
                        <span className="font-extrabold font-sans text-[#07402b] bg-[#07402b]/10 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        <span className="font-bold font-sans">A${shippingFee.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex justify-between text-base font-black text-[#6b1e30] pt-3 border-t border-stone-100">
                      <span>Total Amount</span>
                      <span className="font-sans text-xl">A${total.toFixed(2)} AUD</span>
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <div className="bg-[#faf6f0] p-4 rounded-xl border border-[#c69c40]/25 space-y-2 text-[11px] text-stone-600">
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-4 w-4 text-[#07402b] shrink-0" />
                      <span>Refrigerated Express Cold-Chain Packaging</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-[#c69c40] shrink-0" />
                      <span>100% Satisfaction &amp; Quality Guarantee</span>
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
