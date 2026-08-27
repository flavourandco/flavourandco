"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/types";
import { getValidProductImages } from "@/lib/media";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export default function ProductCard({
  product,
  showBadge = true,
  isWishlisted: externalIsWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [internalIsWishlisted, setInternalIsWishlisted] = useState<boolean>(false);

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted
    ? items.find((i) => i.productId === product.id || i.id === product.id)
    : undefined;
  const quantityInCart = cartItem?.quantity || 0;

  const isWishlisted = externalIsWishlisted ?? internalIsWishlisted;
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist();
    } else {
      setInternalIsWishlisted((w) => !w);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const price = typeof product.price === "number" ? product.price : (Number(product.price) || 0);
  const slug = (product.name || "pie")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const detailUrl = `/shop/${slug}/${product.id}`;

  const productImages = getValidProductImages(product);
  const image1 = productImages[0];
  const image2 = productImages.length > 1 ? productImages[1] : null;

  return (
    <article className="product-card group relative flex flex-col justify-between overflow-hidden bg-white rounded-sm border border-[#c69c40]/25 shadow-xs hover:shadow-lg hover:border-[#c69c40]/50 transition-all duration-300 h-full w-full">

      {/* Image Area (Clickable Link to detail page) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#faf6f0] block">
        <Link href={detailUrl} className="absolute inset-0 z-0 block">
          {/* Primary image */}
          <Image
            src={image1}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Secondary / Hover image */}
          {image2 && (
            <Image
              src={image2}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover absolute inset-0 opacity-0 scale-95 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {/* Soft vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        </Link>

        {/* Ribbon Badge */}
        {showBadge && product.badge && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center text-[8px] sm:text-[9px] font-sans font-extrabold uppercase tracking-wider text-white bg-[#6b1e30]/95 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm border border-[#E3A72B]/40 shadow-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Floating Wishlist Heart Icon Top-Right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-sm bg-white/85 backdrop-blur-md border border-white/70 shadow-xs hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Wishlist product"
        >
          <Heart
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
              isWishlisted
                ? "fill-[#6b1e30] text-[#6b1e30]"
                : "text-stone-600 hover:text-[#6b1e30]"
            }`}
          />
        </button>
      </div>

      {/* Body & Content Area — Compact & Fully Responsive */}
      <div className="flex flex-col flex-grow p-2.5 sm:p-4 justify-between bg-white z-10">

        {/* Top Meta Tag & Title */}
        <div className="flex flex-col gap-1">
          {/* Pack / Serving Meta info */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-[#c69c40]">
            <span className="truncate">{product.packInfo || "Artisan Selection"}</span>
          </div>

          {/* Product Title */}
          <Link href={detailUrl} className="block cursor-pointer group/title">
            <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover/title:text-[#6b1e30] transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Price & Rating Row */}
          <div className="flex items-center justify-between pt-1 gap-1">
            <span className="text-base sm:text-lg font-extrabold font-sans tracking-tight text-[#6b1e30] leading-none shrink-0">
              A${price.toFixed(2)}
            </span>

            {/* Adjusted Ratings: 5 Stars on Desktop/Tablet, Clean Star + 5.0 Rating on Mobile */}
            <div className="flex items-center gap-1 text-[#E3A72B] shrink-0">
              <div className="hidden sm:flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-[#E3A72B] text-[#E3A72B]"
                  />
                ))}
              </div>
              <div className="flex sm:hidden items-center gap-0.5">
                <Star className="h-3 w-3 fill-[#E3A72B] text-[#E3A72B]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-sans font-bold text-stone-600">5.0</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Action Button or Interactive Quantity Stepper */}
        <div className="mt-2.5 pt-2 sm:pt-2.5 border-t border-stone-100 flex items-center gap-2">
          {quantityInCart > 0 && cartItem ? (
            <div className="w-full flex items-center justify-between bg-stone-100/90 rounded-sm p-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(cartItem.id, quantityInCart - 1);
                }}
                className="h-7 w-7 sm:h-7 sm:w-8 rounded-sm bg-white hover:bg-[#6b1e30] text-[#6b1e30] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-200 shadow-2xs"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>

              <span className="font-sans font-extrabold text-xs sm:text-sm text-[#07402b] px-2 select-none">
                {quantityInCart}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem(product, 1);
                }}
                className="h-7 w-7 sm:h-7 sm:w-8 rounded-sm bg-white hover:bg-[#6b1e30] text-[#6b1e30] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-200 shadow-2xs"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              variant="primary"
              className="w-full py-2 px-3 sm:py-2.5 sm:px-4 text-[9px] sm:text-[10px]"
            >
              Add to Cart
            </Button>
          )}
        </div>

      </div>

    </article>
  );
}