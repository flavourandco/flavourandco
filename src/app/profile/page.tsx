"use client";

import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ShoppingBag,
  BookOpen,
  CheckCircle,
  Package,
  Eye,
  X,
  Truck,
  MapPin,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/auth.store";
import { BoneyardProfilePageSkeleton } from "@/components/ui/BoneyardSkeleton";
import type { Order } from "@/lib/types";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const userProfile = useAuthStore((s) => s.userProfile);
  const authLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isHydrating = !isLoaded || (isSignedIn && authLoading) || (!isInitialized && isSignedIn);

  const userEmail = userProfile?.email || user?.primaryEmailAddress?.emailAddress || "";

  useEffect(() => {
    if (userEmail) {
      setLoadingOrders(true);
      fetch("/api/orders")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            const userOrders = json.data.filter(
              (o: Order) => o.customerEmail?.toLowerCase() === userEmail.toLowerCase()
            );
            setOrders(userOrders);
          }
        })
        .catch((err) => console.error("Error loading user orders:", err))
        .finally(() => setLoadingOrders(false));
    }
  }, [userEmail]);

  // Render Boneyard Skeleton during Clerk initialization & Supabase data fetching
  if (isHydrating) {
    return (
      <>
        <HomeNavbar />
        <main className="min-h-screen bg-[#f9f7f2] pt-[100px] sm:pt-[116px] md:pt-[124px] pb-20 px-4 sm:px-6 lg:px-12">
          <BoneyardProfilePageSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  // Once loaded, if user is not signed in render Access Restricted
  if (isLoaded && !isSignedIn) {
    return (
      <>
        <HomeNavbar />
        <main className="min-h-screen bg-[#f9f7f2] pt-[120px] pb-20 px-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-md bg-white p-8 rounded-xl shadow-lg border border-stone-200">
            <h1 className="font-serif text-2xl font-bold text-brand-green mb-3">
              Access Restricted
            </h1>
            <p className="text-stone-600 text-sm mb-6">
              Please log in to view your profile and order history.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-brand-green text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-brand-gold hover:text-brand-green transition-all cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fullName =
    userProfile?.fullName ||
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Valued Customer";

  const firstName = fullName.split(" ")[0] || "Gourmet";
  const avatarUrl = userProfile?.imageUrl || user?.imageUrl || "";
  const userInitial = (firstName[0] || "U").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <HomeNavbar />
      <main className="min-h-screen bg-[#f9f7f2] pt-[100px] sm:pt-[116px] md:pt-[124px] pb-20 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Header Banner */}
          <div className="mb-8 pb-4 border-b border-stone-300/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                My Account
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green mt-1">
                Profile &amp; Dashboard
              </h1>
            </div>
          </div>

          {/* Main Grid: Left Column Profile & Right Column Recent Orders */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Left Column: Minimal Profile */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
              {/* Minimal Avatar */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden my-4 shadow-sm bg-brand-green text-brand-gold flex items-center justify-center text-3xl font-serif font-bold">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* Welcome text & User info */}
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400 font-sans">
                Welcome Back
              </span>
              <h2 className="font-serif text-2xl font-bold text-brand-green mt-1 mb-1 tracking-tight">
                {fullName}
              </h2>
              <p className="text-xs text-stone-500 font-sans mb-6 break-all">
                {userEmail}
              </p>

              {/* Minimal Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 text-stone-600 hover:text-rose-600 font-bold text-xs uppercase tracking-widest py-2 px-4 transition-colors cursor-pointer border-t border-stone-100 w-full pt-4"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            {/* Right Column: Recent Orders */}
            <div className="md:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200/80">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-brand-gold" />
                    My Recent Orders
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
                    <span>Loading your order history from database...</span>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#faf6f0] rounded-xl border border-[#c69c40]/25 p-4 sm:p-5 text-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                          <div>
                            <span className="font-mono font-bold text-brand-green text-sm block">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-AU", { dateStyle: "medium" }) : "Recent"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Paid &amp; Confirmed
                            </span>
                            <span className="font-sans font-bold text-sm text-[#6b1e30]">
                              A${ord.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-1.5 text-stone-700">
                          {Array.isArray(ord.items) &&
                            ord.items.map((it: any, idx: number) => {
                              const itPrice = typeof it.price === "number" ? it.price : (typeof it.unitPrice === "number" ? it.unitPrice : 0);
                              const itQty = it.quantity || 1;
                              return (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                  <span className="font-medium">
                                    {itQty}x {it.name || it.product?.name || "Gourmet Pie"} {it.variantName || it.variant ? `(${it.variantName || it.variant})` : ""}
                                  </span>
                                  <span className="font-mono text-stone-500">
                                    A${(itPrice * itQty).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                        </div>

                        {/* View Order Details Popup Button */}
                        <div className="pt-2 border-t border-stone-200/60 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-brand-green hover:bg-brand-gold hover:text-brand-green rounded-md transition-all cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Order Details</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Minimal Empty State Card */
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                      <BookOpen className="h-7 w-7 stroke-[1.5]" />
                    </div>

                    <h4 className="font-serif text-xl font-bold text-stone-800 mb-2">
                      Your Gourmet Journey Awaits
                    </h4>

                    <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
                      You haven&apos;t placed any pie orders yet. Discover our handcrafted Indo-Australian pies and artisanal bakery selections today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <Link
                        href="/shop"
                        className="w-full sm:w-auto bg-brand-green text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-brand-gold hover:text-brand-green transition-all text-center cursor-pointer shadow-xs"
                      >
                        Explore Menu
                      </Link>
                      <Link
                        href="/blog"
                        className="w-full sm:w-auto text-stone-600 font-bold text-xs uppercase tracking-widest px-6 py-3 transition-colors text-center hover:text-brand-green cursor-pointer"
                      >
                        Read Blogs
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP MODAL: CUSTOMER ORDER DETAILS */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          data-lenis-prevent
        >
          <div className="bg-white w-full max-w-2xl sm:max-w-3xl max-h-[90vh] rounded-2xl border border-[#c69c40]/30 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#faf6f0] shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    Order Receipt
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-bold uppercase rounded-full">
                    Paid &amp; Confirmed
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs text-stone-700 overscroll-contain">
              {/* Order Info & Delivery Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Address */}
                <div className="p-4 bg-[#faf6f0] rounded-xl border border-[#c69c40]/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-[#07402b] font-bold border-b border-stone-200 pb-2">
                    <MapPin className="w-4 h-4 text-[#6b1e30]" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="font-bold text-stone-900">{selectedOrder.customerName}</p>
                  <p className="text-stone-600 leading-relaxed">
                    {typeof selectedOrder.shippingAddress === "object" && selectedOrder.shippingAddress
                      ? `${selectedOrder.shippingAddress.street || ""}, ${selectedOrder.shippingAddress.city || ""}, ${selectedOrder.shippingAddress.state || ""} ${selectedOrder.shippingAddress.postalCode || ""}`
                      : String(selectedOrder.shippingAddress || "Sydney, NSW")}
                  </p>
                  {selectedOrder.customerPhone && (
                    <p className="text-stone-500 font-mono pt-1">Phone: {selectedOrder.customerPhone}</p>
                  )}
                </div>

                {/* Payment & Date Summary */}
                <div className="p-4 bg-[#faf6f0] rounded-xl border border-[#c69c40]/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-[#07402b] font-bold border-b border-stone-200 pb-2">
                    <CreditCard className="w-4 h-4 text-[#6b1e30]" />
                    <span>Payment &amp; Schedule</span>
                  </div>
                  <div className="space-y-1">
                    <p className="flex justify-between">
                      <span className="text-stone-500">Placed On:</span>
                      <span className="font-medium text-stone-800">
                        {selectedOrder.createdAt
                          ? new Date(selectedOrder.createdAt).toLocaleDateString("en-AU", { dateStyle: "long" })
                          : "Recent"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-500">Payment:</span>
                      <span className="font-medium text-stone-800">{selectedOrder.paymentMethod || "Square Card"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-500">Method:</span>
                      <span className="font-medium text-stone-800">{selectedOrder.shippingMethod || "Sydney Express"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#07402b]">
                  Items in this Order ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
                </h4>

                <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#faf6f0] border-b border-stone-200 text-stone-600 font-bold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Variant</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item: any, idx: number) => {
                          const itemPrice = typeof item.price === "number" ? item.price : (typeof item.unitPrice === "number" ? item.unitPrice : 0);
                          const itemQty = item.quantity || 1;
                          const lineTotal = itemPrice * itemQty;
                          const variantLabel = item.variantName || item.variant || "Standard";
                          const itemImg = item.image || item.product?.image || item.product?.images?.[0];

                          return (
                            <tr key={idx} className="hover:bg-stone-50">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  {itemImg ? (
                                    <div className="relative w-8 h-8 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                      <Image src={itemImg} alt={item.name || "Pie"} fill className="object-cover" sizes="32px" />
                                    </div>
                                  ) : (
                                    <PackageCheck className="w-4 h-4 text-stone-400" />
                                  )}
                                  <span className="font-serif font-bold text-stone-900">{item.name || item.product?.name || "Gourmet Pie"}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-stone-500">{variantLabel}</td>
                              <td className="py-2.5 px-3 text-right font-mono">A${itemPrice.toFixed(2)}</td>
                              <td className="py-2.5 px-3 text-center font-bold">{itemQty}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-stone-900 font-mono">
                                A${lineTotal.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-3 px-3 text-center text-stone-400">Order items recorded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="bg-[#faf6f0] p-4 rounded-xl border border-[#c69c40]/20 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Special Instructions</span>
                  <p className="text-stone-700 text-xs italic">
                    {selectedOrder.fulfillmentNotes || "No special instructions provided."}
                  </p>
                </div>

                <div className="w-full sm:w-60 space-y-1 text-xs border-t sm:border-t-0 sm:border-l border-stone-200 sm:pl-4 pt-2 sm:pt-0">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">A${(selectedOrder.subtotal || selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery:</span>
                    <span className="font-mono">{selectedOrder.shippingFee === 0 ? "FREE" : `A$${(selectedOrder.shippingFee || 0).toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-[#6b1e30] font-black text-sm pt-2 border-t border-stone-200">
                    <span>Total Paid:</span>
                    <span className="font-mono text-base">A${selectedOrder.totalAmount.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
