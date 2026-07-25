"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Maximize2 } from "lucide-react";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

const GARNET = "#6b1e30";
const GREEN = "#07402b";
const GOLD = "#c69c40";

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const price = product.price;
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const detailUrl = `/shop/${slug}/${product.id}`;

  return (
    <article className="product-card group relative flex flex-col justify-between overflow-hidden bg-white rounded-2xl border border-[#c69c40]/40 shadow-sm hover:shadow-md transition-all duration-300 h-full">

      {/* Image Area (Clickable Link to detail page) */}
      <Link href={detailUrl} className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#6b1e30]/20 to-[#6b1e30]/5 cursor-pointer block">
        {/* Normal image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Hover image */}
        <Image
          src={product.images[1]}
          alt={`${product.name} hover view`}
          fill
          className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute inset-0"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Bold Badge for Shop */}
        {(product.badge || product.isBestSeller || product.isNewArrival) && (
          <span className="absolute top-3 left-3 text-[10px] font-sans font-extrabold uppercase tracking-widest text-white bg-[#6b1e30] px-3.5 py-1.5 rounded-full border border-[#c69c40]/40 shadow-md z-10">
            {product.badge || (product.isBestSeller ? "Best Seller" : "New Arrival")}
          </span>
        )}

        {/* Expand icon, bottom-right */}
        <div
          className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform z-10"
          aria-label="View detail page"
        >
          <Maximize2 className="h-3.5 w-3.5" style={{ color: GARNET }} />
        </div>
      </Link>

      {/* Body & Content Area */}
      <div className="flex flex-col flex-grow p-5 justify-between bg-white z-10">

        {/* Title & Price Information (Fixed height wrapper for title to keep button positions perfectly consistent) */}
        <div className="flex flex-col gap-2.5">
          <Link href={detailUrl} className="block cursor-pointer">
            <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 h-12 hover:text-[#c69c40] transition-colors duration-300" style={{ color: GARNET }}>
              {product.name}
            </h3>
          </Link>

          {/* Price + Rating */}
          <div className="flex items-end justify-between pt-1">
            <span className="text-2xl font-extrabold font-mono leading-none" style={{ color: GARNET }}>
              A${price.toFixed(2)}
            </span>
            <div className="flex items-center gap-0.5 text-brand-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-brand-gold text-brand-gold"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Action Buttons (always locked at bottom) */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => alert(`Added ${product.name} to cart!`)}
            className="flex-1 bg-[#6b1e30] hover:opacity-90 text-white font-serif font-bold uppercase tracking-wider py-2.5 px-4 text-[10px] transition-opacity duration-300 shadow-sm cursor-pointer"
            style={{
              clipPath: "polygon(5% 0%, 95% 0%, 100% 25%, 95% 50%, 100% 75%, 95% 100%, 5% 100%, 0% 75%, 5% 50%, 0% 25%)"
            }}
          >
            Add to Cart
          </button>

          <button
            onClick={() => setIsWishlisted((w) => !w)}
            className="h-9 w-9 rounded-full border border-[#c69c40]/30 hover:border-[#c69c40] flex items-center justify-center transition-colors duration-300 cursor-pointer bg-white"
            aria-label="Toggle wishlist"
          >
            <Heart
              className="h-4 w-4 transition-transform duration-300 active:scale-95"
              style={
                isWishlisted
                  ? { fill: GARNET, color: GARNET }
                  : { color: `${GARNET}bb` }
              }
            />
          </button>
        </div>

      </div>

    </article>
  );
}