"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";

import Button from "@/components/ui/Button";

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
  const [internalIsWishlisted, setInternalIsWishlisted] = useState<boolean>(false);

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

  const price = product.price;
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const detailUrl = `/shop/${slug}/${product.id}`;

  const image1 = product.images?.[0] || product.image;
  const image2 = product.images?.[1] || image1;

  return (
    <article className="product-card group relative flex flex-col justify-between overflow-hidden bg-white rounded-sm border border-[#c69c40]/25 shadow-xs hover:shadow-xl hover:border-[#c69c40]/50 hover:-translate-y-1 transition-all duration-500 ease-out h-full">

      {/* Image Area (Clickable Link to detail page) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#faf6f0] block">
        <Link href={detailUrl} className="absolute inset-0 z-0 block">
          {/* Primary image */}
          <Image
            src={image1}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Secondary / Hover image */}
          {image2 !== image1 && (
            <Image
              src={image2}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover absolute inset-0 opacity-0 scale-95 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          {/* Soft vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
        </Link>

        {/* Badge */}
        {showBadge && (product.badge || product.isBestSeller || product.isNewArrival) && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center text-[9px] font-sans font-extrabold uppercase tracking-[0.18em] text-white bg-[#6b1e30]/95 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#E3A72B]/40 shadow-xs">
              {product.badge || (product.isBestSeller ? "Best Seller" : "New Arrival")}
            </span>
          </div>
        )}

        {/* Floating Wishlist Heart Icon Top-Right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-sm bg-white/85 backdrop-blur-md border border-white/70 shadow-xs hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Wishlist product"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isWishlisted
              ? "fill-[#6b1e30] text-[#6b1e30]"
              : "text-stone-600 hover:text-[#6b1e30]"
              }`}
          />
        </button>
      </div>

      {/* Body & Content Area */}
      <div className="flex flex-col flex-grow p-4 sm:p-5 justify-between bg-white z-10">

        {/* Top Meta Tag & Title */}
        <div className="flex flex-col gap-1.5">
          {/* Pack / Serving Meta info */}
          <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-[#c69c40]">
            <span>{product.packInfo || "Artisan Selection"}</span>
          </div>

          {/* Product Title */}
          <Link href={detailUrl} className="block cursor-pointer group/title">
            <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug line-clamp-2 h-11 sm:h-13 group-hover/title:text-[#6b1e30] transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Price & Rating */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg sm:text-xl font-extrabold font-sans tracking-tight text-[#6b1e30] leading-none">
              A${price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-[#E3A72B]">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-[#E3A72B] text-[#E3A72B]"
                  />
                ))}
              </div>
              <span className="text-[11px] font-sans font-bold text-stone-500">5.0</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Action Button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
          <Button
            onClick={() => alert(`Added ${product.name} to cart!`)}
            variant="primary"
            className="flex-1 py-2.5 px-4 text-[10px]"
          >
            Add to Cart
          </Button>
        </div>

      </div>

    </article>
  );
}