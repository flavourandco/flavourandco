"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  Truck,
  Sparkles,
  Flame,
  ShieldCheck,
  Package,
  Zap,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";
import { useProductStore } from "@/store/product.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { getValidProductImages } from "@/lib/media";
import PageLayout from "@/components/layout/PageLayout";
import Button from "@/components/ui/Button";
import ProductReviews from "@/components/products/ProductReviews";
import RelatedProducts from "@/components/products/RelatedProducts";
import { useEffect } from "react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const router = useRouter();
  const storeProducts = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const product = storeProducts.find((p) => p.id === productId);
  const validImages = getValidProductImages(product);

  // States
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isCustomQtyInput, setIsCustomQtyInput] = useState<boolean>(false);
  const [customQtyValue, setCustomQtyValue] = useState<string>("10");

  // Active Variant & Unit Price
  const activeVariant = product?.variants?.[selectedVariantIdx];
  const unitPrice = activeVariant ? activeVariant.price : (product?.price || 0);

  // Check if product / variant is already in cart
  const itemId = activeVariant ? `${product?.id}-${activeVariant.name}` : (product?.id || "");
  const isInCart = cartItems.some((i) => i.productId === product?.id || i.id === itemId);

  // Sync quantity state with cart item if present
  useEffect(() => {
    const existingCartItem = cartItems.find((i) => i.id === itemId || i.productId === product?.id);
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
      if (existingCartItem.quantity >= 10) {
        setIsCustomQtyInput(true);
        setCustomQtyValue(String(existingCartItem.quantity));
      }
    }
  }, [itemId, cartItems, product?.id]);

  const handleCustomQtySubmit = () => {
    const parsed = parseInt(customQtyValue, 10);
    const newQty = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setQuantity(newQty);
    setCustomQtyValue(String(newQty));
    if (newQty < 10) {
      setIsCustomQtyInput(false);
    }
    if (isInCart) {
      updateQuantity(itemId, newQty);
    }
    if (product) {
      addToast(`Quantity updated to ${newQty} for ${product.name}!`, "success");
    }
  };

  // Touch Swipe Gesture State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !product || validImages.length <= 1) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      // Swiped left -> next image
      setActiveImageIdx((prev) => (prev + 1) % validImages.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> previous image
      setActiveImageIdx((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
  };

  if (!product) {
    return (
      <PageLayout
        title="Product Not Found"
        subtitle="Please check the URL or head back to the shop."
        fullWidth
        hideHeader={true}
      >
        <div className="bg-cream text-stone-800 min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <h2 className="font-serif text-3xl font-bold text-[#6b1e30] mb-4">
            We couldn&apos;t find this product
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-md bg-[#6b1e30] hover:bg-[#07402b] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-md"
          >
            Back to Shop
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={product.name} subtitle="" fullWidth hideHeader={true}>
      <div className="bg-cream text-stone-800 min-h-screen pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Grid: STABLE Left Column (Image & Side-by-Side CTAs) vs SCROLLABLE Right Column (Details) */}
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">

            {/* ───────────────────────────────────────────────────────────
                LEFT COLUMN: Image Gallery & Side-by-Side Action CTAs (STABLE/STICKY)
               ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 space-y-4">

              {/* Product Images Container */}
              <div className="space-y-3">
                {/* Main Image Display with Touch Swipe Support */}
                <div
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative aspect-[4/3] sm:aspect-square sm:max-h-[380px] w-full overflow-hidden rounded-md border border-[#c69c40]/20 shadow-sm bg-white group select-none touch-pan-y"
                >
                  <Image
                    src={validImages[activeImageIdx] || validImages[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    priority
                    loading="eager"
                  />
                  {/* Category & Badge Overlay */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-[#6b1e30] px-3 py-1 rounded shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails Row (Only render if there are 2 or more real images) */}
                {validImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto py-2.5 px-1 -mx-1">
                    {validImages.map((img, i) => {
                      const isActive = activeImageIdx === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIdx(i)}
                          className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-md transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "border-2 border-[#6b1e30] ring-2 ring-[#6b1e30]/20 shadow-md scale-105"
                              : "border-2 border-stone-200 hover:border-[#c69c40] opacity-75 hover:opacity-100"
                          }`}
                          aria-label={`Switch to photo ${i + 1}`}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} thumbnail ${i + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Side-by-Side Action Buttons & Perks Container */}
              <div className="bg-white rounded-md border border-[#c69c40]/20 p-4 shadow-sm space-y-4">
                {/* Add to Cart / Go to Cart & Order Now side-by-side */}
                <div className="flex flex-row gap-3">
                  {isInCart ? (
                    <Button
                      onClick={() => {
                        router.push("/cart");
                      }}
                      variant="primary"
                      className="flex-1 py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm hover:shadow transition-all rounded-md bg-[#07402b] hover:bg-[#6b1e30]"
                    >
                      <ShoppingBag className="h-4 w-4 shrink-0" />
                      <span className="truncate">Go to Cart</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        addItem(product, quantity, activeVariant?.name, unitPrice);
                      }}
                      variant="primary"
                      className="flex-1 py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm hover:shadow transition-all rounded-md"
                    >
                      <ShoppingBag className="h-4 w-4 shrink-0" />
                      <span className="truncate">Add to Cart</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      clearCart();
                      addItem(product, quantity, activeVariant?.name, unitPrice, { showToast: false });
                      router.push("/checkout");
                    }}
                    variant="secondary"
                    className="flex-1 py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm hover:shadow transition-all rounded-md"
                  >
                    <Zap className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span className="truncate">Order Now</span>
                  </Button>
                </div>

                {/* Wishlist & Share buttons */}
                <div className="flex items-center justify-around pt-2 border-t border-stone-100 text-xs font-semibold text-stone-600">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="inline-flex items-center gap-1.5 hover:text-[#6b1e30] transition-colors cursor-pointer py-0.5"
                  >
                    <Heart
                      className={`h-4 w-4 ${isWishlisted ? "fill-[#6b1e30] text-[#6b1e30]" : "text-stone-400"
                        }`}
                    />
                    <span>{isWishlisted ? "Saved" : "Add to Wishlist"}</span>
                  </button>

                  <div className="h-3.5 w-px bg-stone-200" />

                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Product link copied to clipboard!");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 hover:text-[#6b1e30] transition-colors cursor-pointer py-0.5"
                  >
                    <Share2 className="h-4 w-4 text-stone-400" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Perks Banner */}
                <div className="bg-cream/60 rounded p-3 border border-[#c69c40]/15 space-y-2 text-[11px] text-stone-700">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-[#07402b] shrink-0" />
                    <span><strong>Sydney-Wide Delivery</strong> (Fresh &amp; Frozen)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-[#6b1e30] shrink-0" />
                    <span><strong>Oven & Air Fryer Ready</strong> in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#c69c40] shrink-0" />
                    <span><strong>No Artificial Preservatives</strong></span>
                  </div>
                </div>

              </div>

            </div>

            {/* ───────────────────────────────────────────────────────────
                RIGHT COLUMN: Header, Top Price & Quantity, Clean Minimal Sections (SCROLABLE)
               ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">

              {/* Product Header Title */}
              <div className="space-y-2.5">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#07402b] leading-tight">
                  {product.name}
                </h1>

                {product.tagline && (
                  <p className="font-serif text-base italic text-[#6b1e30] font-medium">
                    &ldquo;{product.tagline}&rdquo;
                  </p>
                )}

                {/* Rating & Review Summary */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-0.5 text-brand-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-brand-gold text-brand-gold"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-800">5.0</span>
                  <span className="text-xs text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-semibold underline cursor-pointer">
                    Verified Customer Reviews
                  </span>
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────
                  PRICE & QUANTITY AT TOP RIGHT (Clean subtle box, static price)
                 ─────────────────────────────────────────────────────────── */}
              <div className="bg-white rounded-md border border-[#c69c40]/20 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                {/* Price (Static Display, does NOT change when quantity increases) */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
                    Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-sans tracking-tight text-[#6b1e30]">
                      A${unitPrice.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#07402b] bg-[#07402b]/10 px-2 py-0.5 rounded border border-[#07402b]/20">
                      <Sparkles className="h-3 w-3" />
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Quantity Select Dropdown or Custom 10+ Input */}
                <div className="flex items-center gap-3">
                  <label htmlFor="product-quantity-dropdown" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Quantity:
                  </label>
                  {isCustomQtyInput ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={customQtyValue}
                        onChange={(e) => setCustomQtyValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCustomQtySubmit();
                          }
                        }}
                        className="w-20 h-9 bg-stone-50 text-[#07402b] font-mono text-sm font-bold px-3 rounded-md border border-[#07402b] focus:outline-none focus:ring-2 focus:ring-[#07402b]/30"
                        placeholder="Qty"
                        autoFocus
                      />
                      {/* Square Tick Box Button */}
                      <button
                        type="button"
                        onClick={handleCustomQtySubmit}
                        className="h-9 w-9 flex items-center justify-center bg-[#07402b] hover:bg-[#6b1e30] text-white rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
                        aria-label="Confirm custom quantity"
                        title="Confirm quantity"
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      {/* Round Reset Icon Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomQtyInput(false);
                          setQuantity(1);
                          if (isInCart) {
                            updateQuantity(itemId, 1);
                          }
                        }}
                        className="h-9 w-9 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-full shadow-xs transition-colors cursor-pointer shrink-0"
                        aria-label="Reset to dropdown"
                        title="Reset to dropdown"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <select
                        id="product-quantity-dropdown"
                        value={quantity >= 10 ? "10+" : quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "10+") {
                            setIsCustomQtyInput(true);
                            setCustomQtyValue(quantity >= 10 ? String(quantity) : "10");
                            const targetQty = quantity >= 10 ? quantity : 10;
                            setQuantity(targetQty);
                            if (isInCart) {
                              updateQuantity(itemId, targetQty);
                            }
                            addToast(`Quantity set to ${targetQty}+! Enter exact amount.`, "info");
                          } else {
                            const newQty = parseInt(val, 10);
                            setQuantity(newQty);
                            if (isInCart) {
                              updateQuantity(itemId, newQty);
                            }
                            addToast(`Quantity updated to ${newQty} for ${product.name}!`, "success");
                          }
                        }}
                        className="appearance-none bg-stone-50 hover:bg-stone-100 text-[#07402b] font-mono text-sm font-bold py-1.5 pl-3.5 pr-8 rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#07402b]/20 transition-colors cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                        <option value="10+">10+</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#07402b]">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Short Summary Description */}
              <p className="text-stone-700 text-sm leading-relaxed pt-1">
                {product.shortDescription}
              </p>

              {/* Serving Info Section */}
              {product.packInfo && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Serving
                  </label>
                  <div className="inline-block bg-white text-stone-800 text-xs font-semibold px-3.5 py-1.5 rounded-md border border-stone-300">
                    {product.packInfo}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────
                  SELECT VARIANTS (Clean, small pills, no prices inside)
                 ─────────────────────────────────────────────────────────── */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Select Variants
                    </label>
                    <span className="text-xs font-mono font-semibold text-[#6b1e30]">
                      {product.variants[selectedVariantIdx]?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => {
                      const isSelected = selectedVariantIdx === idx;
                      return (
                        <button
                          key={v.name}
                          type="button"
                          onClick={() => setSelectedVariantIdx(idx)}
                          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${isSelected
                            ? "bg-[#07402b] text-white border-[#07402b] shadow-sm"
                            : "bg-white text-stone-700 border-stone-300 hover:border-[#07402b]"
                            }`}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full Description Story */}
              <div className="space-y-2 pt-4 border-t border-stone-200/80">
                <h2 className="font-serif text-xl font-bold text-[#07402b]">
                  About {product.name}
                </h2>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Why They Stand Out Section */}
              {product.whyStandOut && product.whyStandOut.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-200/80">
                  <h2 className="font-serif text-xl font-bold text-[#07402b]">
                    Why They Stand Out
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.whyStandOut.map((point, index) => (
                      <div
                        key={index}
                        className="bg-white p-3.5 rounded-md border border-[#c69c40]/15 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#07402b] shrink-0" />
                          <h3 className="font-serif font-bold text-xs text-[#07402b]">
                            {point.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                          {point.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details & Specifications */}
              {product.productDetails && product.productDetails.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-200/80">
                  <h2 className="font-serif text-xl font-bold text-[#07402b]">
                    Product Details
                  </h2>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 bg-white p-4 rounded-md border border-[#c69c40]/15">
                    {product.productDetails.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6b1e30] mt-1 shrink-0" />
                        <span className="font-medium">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}



            </div>

          </div>

          {/* Customer Written Reviews Section */}
          <ProductReviews productId={product.id} productName={product.name} />

          {/* Related Products Section with Reusable ShowMore Component */}
          <RelatedProducts currentProduct={product} initialCount={4} />

        </div>
      </div>
    </PageLayout>
  );
}
