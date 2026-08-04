"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { Product } from "@/lib/data";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

const GARNET = "#6b1e30";

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

  return (
    <article className="product-card relative flex flex-col justify-between overflow-hidden bg-white rounded-lg border border-[#c69c40]/40 shadow-sm hover:shadow-md transition-all duration-300 h-full">

      {/* Image Area (Clickable Link to detail page) */}
      <div className="group relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#6b1e30]/20 to-[#6b1e30]/5 block">
        <Link href={detailUrl} className="absolute inset-0 z-0">
          {/* Normal image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Hover image */}
          <Image
            src={product.images[1]}
            alt={`${product.name} hover view`}
            fill
            className="object-cover absolute inset-0 opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>

        {/* Bold Badge for Shop */}
        {showBadge && (product.badge || product.isBestSeller || product.isNewArrival) && (
          <span className="hidden sm:block absolute top-3 left-3 text-[10px] font-sans font-extrabold uppercase tracking-widest text-white bg-[#6b1e30] px-3.5 py-1.5 rounded-full border border-[#c69c40]/40 shadow-md z-10 pointer-events-none">
            {product.badge || (product.isBestSeller ? "Best Seller" : "New Arrival")}
          </span>
        )}

        {/* Floating Wishlist Heart Icon Top-Right of Product Card Image */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200/60 shadow-sm hover:bg-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Wishlist product"
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-90 ${
              isWishlisted
                ? "fill-[#6b1e30] text-[#6b1e30]"
                : "text-stone-600 hover:text-[#6b1e30]"
            }`}
          />
        </button>
      </div>

      {/* Body & Content Area */}
      <div className="flex flex-col flex-grow p-3 sm:p-5 justify-between bg-white z-10">

        {/* Title & Price Information */}
        <div className="flex flex-col gap-2.5">
          <Link href={detailUrl} className="block cursor-pointer">
            <h3 className="font-serif font-extrabold text-base sm:text-lg leading-snug line-clamp-2 h-12 sm:h-14 hover:text-[#c69c40] transition-colors duration-300" style={{ color: GARNET }}>
              {product.name}
            </h3>
          </Link>

          {/* Price + Rating */}
          <div className="flex items-end justify-between pt-1">
            <span className="text-lg sm:text-2xl font-extrabold font-mono leading-none" style={{ color: GARNET }}>
              A${price.toFixed(2)}
            </span>
            <div className="hidden sm:flex items-center gap-0.5 text-brand-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-brand-gold text-brand-gold"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Action Button */}
        <div className="mt-4 flex items-center gap-2">
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