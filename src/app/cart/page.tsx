"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Flame,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Clock,
  Heart,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShippingFee = useCartStore((s) => s.getShippingFee);
  const getTotal = useCartStore((s) => s.getTotal);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageLayout
        title="Your Cart"
        subtitle="Review your artisanal pie selections before checkout."
        fullWidth
        hideHeader
      >
        <div className="bg-[#fdfbf7] min-h-[75vh] flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#6b1e30] border-t-transparent" />
          <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-widest">
            Loading your cart...
          </span>
        </div>
      </PageLayout>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();
  const freeShippingThreshold = 200;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <PageLayout
      title="Shopping Cart"
      hideHeader
      fullWidth
    >
      <div className="bg-[#fdfbf7] text-stone-800 min-h-screen pb-20 pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-6xl">
          
          {/* TOP STEP NAVIGATION & BRAND ACCENT */}
          <div className="mb-8 pb-6 border-b border-[#c69c40]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#6b1e30] transition-colors group mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Continue Shopping</span>
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#07402b] tracking-tight">
                Your Shopping Cart
              </h1>
            </div>

            {/* Stepper Pill */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 bg-white px-4 py-2 rounded-full border border-[#c69c40]/20 shadow-2xs">
              <span className="text-[#6b1e30] font-bold flex items-center gap-1">
                Cart ({totalItemsCount})
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-400">Delivery &amp; Payment</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-400">Confirmation</span>
            </div>
          </div>
          
          {items.length === 0 ? (
            /* EMPTY CART LUXURY STATE */
            <div className="mx-auto max-w-2xl text-center py-20 bg-white rounded-3xl border border-[#c69c40]/25 p-8 sm:p-12 shadow-sm space-y-5">
              <div className="h-20 w-20 mx-auto rounded-full bg-[#faf6f0] border border-[#c69c40]/20 flex items-center justify-center text-[#6b1e30] shadow-xs">
                <ShoppingBag className="h-9 w-9 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1e30]">
                  Your cart is currently empty
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Discover our handcrafted butter chicken pies, slow-cooked lamb keema, artisan grazing boxes, and vegetarian delicacies.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/shop">
                  <Button variant="primary" className="py-3.5 px-8 text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:shadow-lg">
                    Explore Gourmet Menu
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* ACTIVE CART GRID */
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              
              {/* LEFT COLUMN: ITEM LIST (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Free Shipping Progress Indicator */}
                <div className="bg-white rounded-2xl border border-[#c69c40]/25 p-5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="flex items-center gap-2 text-[#07402b]">
                      <Truck className="h-4 w-4 text-[#07402b]" />
                      {remainingForFreeShipping > 0 ? (
                        <>
                          Add <strong className="text-[#6b1e30] font-mono">A${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Delivery</strong>!
                        </>
                      ) : (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> You unlocked FREE Express Delivery!
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-stone-400 text-[11px]">{progressToFreeShipping.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c69c40] via-[#07402b] to-emerald-600 transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items List Container */}
                <div className="bg-white rounded-3xl border border-[#c69c40]/25 p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#07402b]">
                      Selected Items ({totalItemsCount})
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your cart?")) {
                          clearCart();
                        }
                      }}
                      className="text-[11px] font-bold uppercase tracking-wider text-stone-400 hover:text-[#6b1e30] transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 space-y-4">
                    {items.map((item) => {
                      const slug = item.product.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "");
                      const detailUrl = `/shop/${slug}/${item.product.id}`;
                      const lineTotal = item.unitPrice * item.quantity;
                      const imageSrc = item.product.images?.[0] || item.product.image;

                      return (
                        <div
                          key={item.id}
                          className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                        >
                          {/* Thumbnail & Product Info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Link
                              href={detailUrl}
                              className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl border border-[#c69c40]/25 bg-[#faf6f0] shadow-2xs group"
                            >
                              <Image
                                src={imageSrc}
                                alt={item.product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="88px"
                              />
                            </Link>

                            <div className="space-y-1 min-w-0">
                              <Link href={detailUrl} className="hover:text-[#6b1e30] transition-colors block">
                                <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-snug truncate">
                                  {item.product.name}
                                </h3>
                              </Link>
                              
                              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                                {item.variantName && (
                                  <span className="bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded border border-stone-200">
                                    {item.variantName}
                                  </span>
                                )}
                                <span className="text-stone-400 font-mono">
                                  A${item.unitPrice.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stepper, Total, & Remove */}
                          <div className="flex items-center justify-between w-full sm:w-auto gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                            {/* Stepper */}
                            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl p-1 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 rounded-lg bg-white hover:bg-[#6b1e30] text-stone-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-200 shadow-2xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-mono text-xs font-extrabold w-7 text-center text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 rounded-lg bg-white hover:bg-[#6b1e30] text-stone-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-200 shadow-2xs"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Line Total */}
                            <div className="text-right min-w-[75px]">
                              <span className="text-sm sm:text-base font-black font-mono tracking-tight text-[#6b1e30] block">
                                A${lineTotal.toFixed(2)}
                              </span>
                            </div>

                            {/* Trash Button */}
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Back to Shop Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#07402b] hover:text-[#6b1e30] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Explore More Gourmet Varieties</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR (5 COLS) */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-[132px] self-start">
                
                {/* Luxury Receipt Card */}
                <div className="bg-white rounded-3xl border border-[#c69c40]/30 p-6 sm:p-7 shadow-md space-y-6 relative overflow-hidden">
                  
                  {/* Top Decorative Gold Foil Header Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#07402b] via-[#c69c40] to-[#6b1e30]" />

                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c69c40] font-bold block">
                        Summary Breakdown
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#07402b]">
                        Estimated Total
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-[#6b1e30] bg-[#6b1e30]/10 px-3 py-1 rounded-full">
                      {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs text-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Items Subtotal</span>
                      <span className="font-bold font-mono text-stone-900 text-sm">A${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-500">Estimated Delivery</span>
                        <Truck className="w-3.5 h-3.5 text-[#07402b]" />
                      </div>
                      {subtotal >= 200 ? (
                        <span className="font-extrabold font-sans text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                          FREE
                        </span>
                      ) : (
                        <span className="font-mono text-stone-600">Calculated at checkout</span>
                      )}
                    </div>

                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>GST (10% Included)</span>
                      <span className="font-mono">A${((total * 10) / 110).toFixed(2)}</span>
                    </div>

                    {/* Total Highlight */}
                    <div className="flex justify-between items-baseline pt-4 border-t border-stone-200">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Subtotal Due</span>
                        <span className="text-xs text-stone-400 font-medium">Delivery fee calculated next</span>
                      </div>
                      <span className="font-mono text-2xl sm:text-3xl font-black text-[#6b1e30]">
                        A${subtotal.toFixed(2)} <span className="text-xs font-sans font-bold text-stone-600">AUD</span>
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA Button */}
                  <Button
                    onClick={() => router.push("/checkout")}
                    variant="primary"
                    className="w-full py-4 px-6 text-xs font-bold uppercase tracking-widest gap-2 shadow-md hover:shadow-lg rounded-full"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Trust Footer Badges */}
                  <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#c69c40]/25 space-y-2 text-[11px] text-stone-700">
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-4 w-4 text-[#07402b] shrink-0" />
                      <span><strong>Direct Cold-Chain Delivery</strong> across Australia</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Flame className="h-4 w-4 text-[#6b1e30] shrink-0" />
                      <span><strong>Oven &amp; Air Fryer Ready</strong> in minutes</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-[#c69c40] shrink-0" />
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
