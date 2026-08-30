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
  Download,
  Printer,
  FileText,
  Star,
  Clock,
  Check,
} from "lucide-react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/auth.store";
import { BoneyardProfilePageSkeleton } from "@/components/ui/BoneyardSkeleton";
import OrderReceiptModal from "@/components/orders/OrderReceiptModal";
import type { Order } from "@/lib/types";

function getOrderProductTitle(items?: any[]): string {
  if (!Array.isArray(items) || items.length === 0) return "Gourmet Pie Order";
  const names = items
    .map((it) => it.name || it.product?.name || "Gourmet Pie")
    .filter(Boolean);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names[0]} & ${names.length - 1} more items`;
}

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
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

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
            <div className="md:col-span-4 flex flex-col items-center text-center p-4 bg-white rounded-sm border-0 shadow-xs">
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
              <div className="bg-white rounded-sm border-0 p-4 sm:p-6 shadow-xs">
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
                    {orders.map((ord) => {
                      const isCompleted = ord.status === "completed";
                      const isCancelled = ord.status === "cancelled";
                      const isShipped = ord.status === "shipped";
                      const isProcessing = ord.status === "processing";

                      // First item product URL for review shortcut
                      const firstItem = Array.isArray(ord.items) && ord.items.length > 0 ? (ord.items[0] as any) : null;
                      const firstItemName = firstItem?.name || firstItem?.product?.name || "pie";
                      const firstItemSlug = firstItemName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "");
                      const firstItemId = firstItem?.id || firstItem?.productId || firstItem?.product_id;
                      const reviewUrl = firstItemId ? `/shop/${firstItemSlug}/${firstItemId}#reviews` : "/shop";

                      return (
                        <div
                          key={ord.id}
                          className="bg-[#faf6f0] rounded-sm p-4 sm:p-5 text-xs space-y-3.5 shadow-2xs hover:bg-[#f5efe3] transition-colors border-0"
                        >
                          {/* Card Header: Order #, Date, Status Badge & Price */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-stone-200/50">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-stone-500 font-medium text-[11px]">
                                  #{ord.orderNumber}
                                </span>
                                <span className="text-stone-300">&bull;</span>
                                <span className="text-stone-500 font-medium text-[11px]">
                                  {ord.createdAt
                                    ? new Date(ord.createdAt).toLocaleDateString("en-AU", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                    : "Recent"}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-[#07402b] text-base sm:text-lg mt-0.5">
                                {getOrderProductTitle(ord.items)}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                                  <span>Delivered</span>
                                </span>
                              ) : isCancelled ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                                  <X className="w-3 h-3 text-rose-700" />
                                  <span>Cancelled</span>
                                </span>
                              ) : isShipped ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                                  <Truck className="w-3 h-3 text-blue-700" />
                                  <span>Shipped</span>
                                </span>
                              ) : isProcessing ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>In Kitchen</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700">
                                  <Package className="w-3 h-3 text-stone-500" />
                                  <span>Placed</span>
                                </span>
                              )}

                              <span className="font-mono font-black text-sm sm:text-base text-[#6b1e30]">
                                A${ord.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Minimal Items Preview */}
                          <div className="space-y-1 py-0.5">
                            {Array.isArray(ord.items) &&
                              ord.items.map((it: any, idx: number) => {
                                const itPrice = typeof it.price === "number" ? it.price : (typeof it.unitPrice === "number" ? it.unitPrice : 0);
                                const itQty = it.quantity || 1;
                                const itemName = it.name || it.product?.name || "Gourmet Pie";
                                const itemImg = it.image || it.product?.image || it.product?.images?.[0];

                                return (
                                  <div key={idx} className="flex items-center justify-between py-1.5 px-0.5 text-xs">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      {itemImg ? (
                                        <div className="relative w-7 h-7 rounded-xs overflow-hidden bg-stone-200/50 shrink-0">
                                          <Image src={itemImg} alt={itemName} fill className="object-cover" sizes="28px" />
                                        </div>
                                      ) : (
                                        <PackageCheck className="w-3.5 h-3.5 text-[#07402b] shrink-0" />
                                      )}
                                      <p className="font-serif text-xs sm:text-sm font-bold text-stone-900 truncate m-0 flex items-center">
                                        <span className="font-sans font-semibold text-stone-500 text-xs sm:text-sm mr-1.5 shrink-0">
                                          {itQty}x
                                        </span>
                                        <span className="truncate">{itemName}</span>
                                      </p>
                                    </div>
                                    <span className="font-mono text-stone-800 font-bold shrink-0 text-xs whitespace-nowrap pl-2">
                                      A${(itPrice * itQty).toFixed(2)}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Card Footer Actions */}
                          <div className="pt-2 border-t border-stone-200/50 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              {isCompleted ? (
                                <Link
                                  href={reviewUrl}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c69c40] bg-white hover:bg-[#c69c40] hover:text-white rounded-sm transition-all shadow-2xs cursor-pointer"
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>Review</span>
                                </Link>
                              ) : isCancelled ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 rounded-sm">
                                  <X className="w-3 h-3 text-rose-600" />
                                  <span>Cancelled</span>
                                </span>
                              ) : isShipped ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrder(ord)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 hover:bg-blue-200/70 rounded-sm transition-all cursor-pointer"
                                >
                                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Shipped</span>
                                </button>
                              ) : isProcessing ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrder(ord)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 hover:bg-amber-200/70 rounded-sm transition-all cursor-pointer"
                                >
                                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                                  <span>In Kitchen</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrder(ord)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-700 bg-stone-200/70 hover:bg-stone-300/70 rounded-sm transition-all cursor-pointer"
                                >
                                  <Package className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Order Placed</span>
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setReceiptOrder(ord)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#07402b] bg-white hover:bg-[#E3A72B] hover:text-[#07402b] rounded-sm transition-all cursor-pointer shadow-2xs"
                              >
                                <Download className="w-3 h-3 text-[#6b1e30]" />
                                <span>Receipt</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedOrder(ord)}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-[#07402b] hover:bg-[#c69c40] hover:text-[#07402b] rounded-sm transition-all cursor-pointer shadow-xs"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Details</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          <div className="bg-white w-full max-w-2xl sm:max-w-3xl max-h-[90vh] rounded-sm border-0 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#faf6f0] shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase rounded-sm flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Paid &amp; Confirmed
                  </span>
                  <span className="text-[11px] font-mono text-stone-500 font-semibold">
                    Order #{selectedOrder.orderNumber}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#07402b]">
                  {getOrderProductTitle(selectedOrder.items)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-sm text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs text-stone-700 overscroll-contain">
              {/* MODAL STATUS SECTION: HORIZONTAL TIMELINE OR DELIVERED BANNER */}
              {(() => {
                const isCompleted = selectedOrder.status === "completed";
                const isCancelled = selectedOrder.status === "cancelled";
                const isShipped = selectedOrder.status === "shipped";
                const isProcessing = selectedOrder.status === "processing";

                const modalFirstItem = Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (selectedOrder.items[0] as any) : null;
                const modalItemName = modalFirstItem?.name || modalFirstItem?.product?.name || "pie";
                const modalItemSlug = modalItemName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                const modalItemId = modalFirstItem?.id || modalFirstItem?.productId || modalFirstItem?.product_id;
                const modalReviewUrl = modalItemId ? `/shop/${modalItemSlug}/${modalItemId}#reviews` : "/shop";

                if (isCompleted) {
                  return (
                    <div className="bg-[#e6f4ea] border border-[#b7e1cd] rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-[#07402b] block">Delivered Fresh &bull; Order Completed</span>
                          <span className="text-xs text-emerald-900">We hope you loved every bite of your gourmet pies!</span>
                        </div>
                      </div>
                      <Link
                        href={modalReviewUrl}
                        onClick={() => setSelectedOrder(null)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c69c40] hover:bg-[#b08832] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-2xs shrink-0 self-end sm:self-auto"
                      >
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Rate &amp; Review</span>
                      </Link>
                    </div>
                  );
                }

                if (isCancelled) {
                  return (
                    <div className="bg-rose-50 border border-rose-200 rounded-sm p-3.5 flex items-center gap-2.5 text-rose-900">
                      <X className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>This order was cancelled. Please contact support if you have any questions.</span>
                    </div>
                  );
                }

                return (
                  <div className="bg-[#faf6f0] border border-[#ede3d7] rounded-sm p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69c40]">
                        Order Fulfilment Status
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-2xs ${isShipped
                          ? "bg-blue-600 text-white font-extrabold"
                          : isProcessing
                            ? "bg-amber-600 text-white font-extrabold"
                            : "bg-[#07402b] text-white font-extrabold"
                          }`}
                      >
                        <span className="text-white/80 font-semibold">Current Status:</span>
                        <span className="text-white font-black">
                          {isShipped ? "Shipped" : isProcessing ? "In Preparation" : "Order Placed"}
                        </span>
                      </span>
                    </div>

                    <div className="relative pt-1 pb-1">
                      {/* Line */}
                      <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 z-0" />
                      <div
                        className="absolute top-4 left-6 h-0.5 bg-emerald-600 z-0 transition-all duration-500"
                        style={{
                          width: isShipped ? "calc(100% - 48px)" : isProcessing ? "calc(50% - 24px)" : "0%",
                        }}
                      />

                      <div className="relative z-10 grid grid-cols-3 text-center">
                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="font-bold text-stone-800 text-[11px] mt-1.5">Placed</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs ${isShipped
                              ? "bg-emerald-600 text-white"
                              : isProcessing
                                ? "bg-amber-500 text-white ring-4 ring-amber-100"
                                : "bg-stone-200 text-stone-500"
                              }`}
                          >
                            {isShipped ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : isProcessing ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              "2"
                            )}
                          </div>
                          <span
                            className={`text-[11px] mt-1.5 ${isProcessing ? "font-bold text-amber-900" : isShipped ? "font-bold text-stone-800" : "font-medium text-stone-400"
                              }`}
                          >
                            Processing
                          </span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs ${isShipped
                              ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-bounce"
                              : "bg-stone-200 text-stone-500"
                              }`}
                          >
                            {isShipped ? <Truck className="w-3.5 h-3.5" /> : "3"}
                          </div>
                          <span
                            className={`text-[11px] mt-1.5 ${isShipped ? "font-bold text-blue-900" : "font-medium text-stone-400"
                              }`}
                          >
                            Shipped
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Order Info & Delivery Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Address */}
                <div className="p-4 bg-[#faf6f0] rounded-sm space-y-2">
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
                <div className="p-4 bg-[#faf6f0] rounded-sm space-y-2">
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

                <div className="rounded-sm overflow-hidden bg-white">
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
                                    <div className="relative w-9 h-9 rounded-sm overflow-hidden bg-stone-100 shrink-0 border-0 shadow-xs">
                                      <Image src={itemImg} alt={item.name || "Pie"} fill className="object-cover" sizes="36px" />
                                    </div>
                                  ) : (
                                    <PackageCheck className="w-4 h-4 text-brand-green" />
                                  )}
                                  <span className="font-serif font-bold text-brand-green text-sm sm:text-base">
                                    {item.name || item.product?.name || "Gourmet Pie"}
                                  </span>
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
              <div className="bg-[#faf6f0] p-4 rounded-sm flex flex-col sm:flex-row justify-between gap-4">
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
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setReceiptOrder(selectedOrder);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#faf6f0] hover:bg-[#E3A72B] hover:text-[#07402b] text-[#07402b] border border-stone-300 font-bold text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#6b1e30]" />
                <span>Download Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-brand-green hover:bg-brand-gold hover:text-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: OFFICIAL RECEIPT & TAX INVOICE */}
      <OrderReceiptModal
        order={receiptOrder}
        isOpen={Boolean(receiptOrder)}
        onClose={() => setReceiptOrder(null)}
      />

      <Footer />
    </>
  );
}
