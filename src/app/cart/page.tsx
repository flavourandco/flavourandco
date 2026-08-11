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
      >
        <div className="bg-cream min-h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6b1e30] border-t-transparent" />
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

  return (
    <PageLayout
      title="Your Shopping Cart"
      subtitle="Handcrafted Indo-Australian pies delivered frozen & fresh direct to your doorstep."
      fullWidth
    >
      <div className="bg-cream text-stone-800 min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {items.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="mx-auto max-w-2xl text-center py-16 sm:py-24 bg-white/70 rounded-xl border border-[#c69c40]/20 p-8 shadow-xs">
              <div className="h-16 w-16 mx-auto mb-5 rounded-full bg-[#6b1e30]/10 flex items-center justify-center text-[#6b1e30]">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1e30] mb-2">
                Your cart is currently empty
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
                Looks like you haven&apos;t added any gourmet pies or grazing boxes to your cart yet. Explore our handcrafted selection!
              </p>
              <Link href="/shop">
                <Button variant="primary" className="py-3 px-8 text-xs font-bold uppercase tracking-widest">
                  Explore Full Menu
                </Button>
              </Link>
            </div>
          ) : (
            /* ACTIVE CART GRID */
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-start">
              
              {/* LEFT COLUMN: ITEM LIST */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                
                {/* Header & Clear Cart button */}
                <div className="flex items-center justify-between pb-4 border-b border-[#c69c40]/25">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#07402b]">
                    Cart Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                      }
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#6b1e30] transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Free Shipping Progress Indicator */}
                <div className="bg-white rounded-lg border border-[#c69c40]/20 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="flex items-center gap-1.5 text-[#07402b]">
                      <Truck className="h-4 w-4" />
                      {remainingForFreeShipping > 0 ? (
                        <>Add <strong className="text-[#6b1e30]">A${remainingForFreeShipping.toFixed(2)}</strong> more for FREE Express Shipping!</>
                      ) : (
                        <span className="text-[#07402b] font-extrabold">You unlocked FREE Express Shipping! 🎉</span>
                      )}
                    </span>
                    <span className="font-mono text-stone-500">{progressToFreeShipping.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c69c40] to-[#07402b] transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
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
                        className="bg-white rounded-lg border border-[#c69c40]/20 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#c69c40]/40"
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Link href={detailUrl} className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-[#faf6f0]">
                            <Image
                              src={imageSrc}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </Link>

                          <div className="space-y-1">
                            <Link href={detailUrl} className="hover:text-[#6b1e30] transition-colors">
                              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                                {item.product.name}
                              </h3>
                            </Link>
                            {item.variantName && (
                              <span className="inline-block bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                Variant: {item.variantName}
                              </span>
                            )}
                            <p className="text-xs font-extrabold font-sans text-[#6b1e30]">
                              A${item.unitPrice.toFixed(2)} <span className="text-stone-400 font-normal">each</span>
                            </p>
                          </div>
                        </div>

                        {/* Right: Quantity Stepper & Subtotal */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                          {/* Stepper */}
                          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 rounded bg-white hover:bg-[#6b1e30] text-[#6b1e30] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-sans text-xs font-extrabold w-6 text-center text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 rounded bg-white hover:bg-[#6b1e30] text-[#6b1e30] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[80px]">
                            <span className="text-base sm:text-lg font-black font-sans tracking-tight text-[#6b1e30] block">
                              A${lineTotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Trash Icon */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back to Shop Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#07402b] hover:text-[#6b1e30] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: ORDER SUMMARY */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
                <div className="bg-white rounded-xl border border-[#c69c40]/25 p-6 shadow-sm space-y-5">
                  <h3 className="font-serif text-xl font-bold text-[#07402b] pb-3 border-b border-stone-100">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm text-stone-700">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold font-sans">A${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Express Shipping</span>
                      {shippingFee === 0 ? (
                        <span className="font-extrabold font-sans text-[#07402b]">FREE</span>
                      ) : (
                        <span className="font-bold font-sans">A${shippingFee.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-base sm:text-lg font-black text-[#6b1e30]">
                      <span>Total AUD</span>
                      <span className="font-sans tracking-tight text-xl sm:text-2xl">
                        A${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/checkout")}
                    variant="primary"
                    className="w-full py-3.5 px-6 text-xs font-bold uppercase tracking-widest gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-stone-100 space-y-2.5 text-[11px] text-stone-600">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#07402b] shrink-0" />
                      <span>Insulated Thermal Cold-Chain Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-[#6b1e30] shrink-0" />
                      <span>Oven &amp; Air Fryer Ready in Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#c69c40] shrink-0" />
                      <span>Freshness &amp; Quality Guaranteed</span>
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
