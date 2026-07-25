"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Heart, Share2 } from "lucide-react";
import { products } from "@/lib/data";
import PageLayout from "@/components/PageLayout";
import Button from "@/components/Button";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const product = products.find((p) => p.id === productId);

  // Servings options (Pack of 2, Pack of 6)
  const servingsOptions = product?.variants && product.variants.length > 0
    ? product.variants
    : [
        { name: "Pack of 2", price: product?.price ?? 22.99 },
        { name: "Pack of 6", price: (product?.price ?? 22.99) * 2.8 }
      ];

  // Preparation options (Freshly Baked, Frozen)
  const preparationOptions = product?.preparationOptions && product.preparationOptions.length > 0
    ? product.preparationOptions
    : ["Freshly Baked", "Frozen"];

  // States
  const [selectedServingIdx, setSelectedServingIdx] = useState<number>(0);
  const [selectedPreparation, setSelectedPreparation] = useState<string>("Freshly Baked");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  if (!product) {
    return (
      <PageLayout title="Product Not Found" subtitle="Please check the URL or head back to the shop." fullWidth hideHeader={true}>
        <div className="bg-cream text-stone-800 min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <h2 className="font-serif text-3xl font-bold text-[#6b1e30] mb-4">We couldn&apos;t find this product</h2>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-md bg-[#6b1e30] hover:bg-[#07402b] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-md">
            Back to Shop
          </Link>
        </div>
      </PageLayout>
    );
  }

  const currentPrice = servingsOptions[selectedServingIdx]?.price ?? product.price;
  const totalPrice = currentPrice * quantity;

  return (
    <PageLayout title={product.name} subtitle="" fullWidth hideHeader={true}>
      <div className="bg-cream text-stone-800 min-h-screen py-12 md:py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Back button */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#6b1e30] hover:text-[#07402b] transition-colors text-xs font-bold uppercase tracking-wider mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shop</span>
          </Link>

          {/* Dynamic Details Layout Grid */}
          <div className="grid gap-12 lg:grid-cols-12 items-start mt-6">
            
            {/* Left: Image Column (6 cols) */}
            <div className="lg:col-span-6 flex flex-col md:flex-row gap-4 items-start">
              
              {/* Thumbnails vertical block */}
              <div className="flex flex-row md:flex-col gap-3 shrink-0 order-last md:order-first w-full md:w-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                      activeImageIdx === i
                        ? "border-[#c69c40] scale-105"
                        : "border-[#c69c40]/20 hover:border-[#c69c40]/60"
                    }`}
                    aria-label={`Switch to product image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Big Main Image display */}
              <div className="relative aspect-square flex-1 w-full overflow-hidden rounded-xl border border-[#c69c40]/25 shadow-md bg-white">
                <Image
                  src={product.images[activeImageIdx]}
                  alt={product.name}
                  fill
                  className="object-cover animate-fadeIn"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>

            </div>

            {/* Right: Option Selectors & Descriptions Column (6 cols) */}
            <div className="lg:col-span-6 text-left space-y-6 lg:pl-4">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#6b1e30] bg-[#6b1e30]/5 px-3 py-1 rounded border border-[#6b1e30]/15">
                  {product.category === "freshly-baked"
                    ? "Freshly Baked"
                    : product.category === "frozen"
                    ? "Frozen Packs"
                    : "Grazing Box"}
                </span>
                {(product.badge || product.isBestSeller || product.isNewArrival) && (
                  <span
                    className="inline-block text-[8px] sm:text-[9px] font-serif font-bold uppercase tracking-wider text-white bg-[#07402b] px-3.5 py-1"
                    style={{
                      clipPath: "polygon(6% 0%, 94% 0%, 100% 25%, 94% 50%, 100% 75%, 94% 100%, 6% 100%, 0% 75%, 6% 50%, 0% 25%)"
                    }}
                  >
                    {product.badge || (product.isBestSeller ? "Best Seller" : "New Arrival")}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#07402b] leading-tight mt-4">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex flex-wrap items-center gap-6 py-2 border-y border-[#c69c40]/25">
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-extrabold font-mono text-[#6b1e30] leading-none">
                    A${totalPrice.toFixed(2)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs font-mono opacity-65">
                      (A${currentPrice.toFixed(2)} each)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                  ))}
                  <span className="text-xs text-stone-600 ml-2 font-bold uppercase tracking-wide">5.0 (Review Score)</span>
                </div>
              </div>

              {/* Servings Selector (Pack of 2, Pack of 6) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Servings *
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {servingsOptions.map((choice, i) => (
                    <button
                      key={choice.name}
                      onClick={() => setSelectedServingIdx(i)}
                      className={`text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded border transition-all duration-300 cursor-pointer ${
                        selectedServingIdx === i
                          ? "bg-[#07402b] text-cream border-[#07402b] shadow-sm scale-[1.02]"
                          : "bg-white text-stone-600 border-[#c69c40]/20 hover:border-[#c69c40]"
                      }`}
                    >
                      {choice.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preparation Selector (Freshly Baked or Frozen) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Preparation *
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {preparationOptions.map((prep) => (
                    <button
                      key={prep}
                      onClick={() => setSelectedPreparation(prep)}
                      className={`text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded border transition-all duration-300 cursor-pointer ${
                        selectedPreparation === prep
                          ? "bg-[#07402b] text-cream border-[#07402b] shadow-sm scale-[1.02]"
                          : "bg-white text-stone-600 border-[#c69c40]/20 hover:border-[#c69c40]"
                      }`}
                    >
                      {prep}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Quantity *
                </span>
                <div className="flex items-center gap-3 border border-[#c69c40]/25 rounded-md p-1 bg-white w-32 justify-between">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-8 w-8 rounded flex items-center justify-center bg-cream border border-[#c69c40]/15 text-[#6b1e30] hover:bg-[#6b1e30] hover:text-white transition-all duration-300 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-sm font-bold text-[#07402b] w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-8 w-8 rounded flex items-center justify-center bg-cream border border-[#c69c40]/15 text-[#6b1e30] hover:bg-[#6b1e30] hover:text-white transition-all duration-300 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-5">
                <Button
                  onClick={() =>
                    alert(
                      `Added ${quantity}x ${product.name} (${servingsOptions[selectedServingIdx]?.name}, ${selectedPreparation}) to cart!`
                    )
                  }
                  variant="primary"
                  className="flex-1 py-4 px-6 text-xs tracking-widest gap-2 shadow-md"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </Button>
                
                <Button
                  onClick={() =>
                    alert(
                      `Proceeding to checkout with ${quantity}x ${product.name} (${servingsOptions[selectedServingIdx]?.name}, ${selectedPreparation})...`
                    )
                  }
                  variant="secondary"
                  className="flex-1 py-4 px-6 text-xs tracking-widest shadow-md"
                >
                  Buy Now
                </Button>
              </div>

              {/* Wishlist & Share buttons */}
              <div className="flex items-center gap-4 pt-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="inline-flex items-center gap-2 hover:text-[#6b1e30] transition-colors cursor-pointer"
                >
                  <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-[#6b1e30] text-[#6b1e30]" : ""}`} />
                  <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Product link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-2 hover:text-[#6b1e30] transition-colors cursor-pointer"
                >
                  <Share2 className="h-4.5 w-4.5" />
                  <span>Share Product</span>
                </button>
              </div>

              {/* Detailed Description */}
              <div className="pt-6 border-t border-[#c69c40]/25 space-y-3 text-left">
                <h3 className="font-serif text-lg font-bold text-[#07402b]">{product.name} Info</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageLayout>
  );
}
