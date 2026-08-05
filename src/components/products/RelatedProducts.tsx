"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useProductStore } from "@/store/product.store";
import ProductCard from "./ProductCard";
import ShowMore from "@/components/ui/ShowMore";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  currentProduct: Product;
  initialCount?: number;
}

export default function RelatedProducts({
  currentProduct,
  initialCount = 4,
}: RelatedProductsProps) {
  const [visibleCount, setVisibleCount] = useState<number>(initialCount);
  const products = useProductStore((s) => s.products);

  // Filter out current product and prioritize products of the same category
  const filteredProducts = products.filter((p) => p.id !== currentProduct.id);
  const sameCategoryProducts = filteredProducts.filter(
    (p) => p.category === currentProduct.category
  );
  const otherProducts = filteredProducts.filter(
    (p) => p.category !== currentProduct.category
  );

  // Combine category matches first, followed by others
  const relatedList = [...sameCategoryProducts, ...otherProducts];

  const visibleProducts = relatedList.slice(0, visibleCount);
  const hasMore = visibleCount < relatedList.length;
  const remainingCount = relatedList.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (relatedList.length === 0) return null;

  return (
    <section className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-[#c69c40]/30">
      <div className="space-y-4 sm:space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#c69c40]/25 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#07402b] text-xs font-extrabold uppercase tracking-widest mb-1">
              <Sparkles className="h-4 w-4 text-[#c69c40]" />
              <span>Pairing Suggestions</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#07402b]">
              You May Also Like
            </h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm">
            Handcrafted Indian-Australian delicacies crafted to complement your meal.
          </p>
        </div>

        {/* Product Cards Grid (2 per row on mobile, 4 per row on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 items-stretch">
          {visibleProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} showBadge={true} />
          ))}
        </div>

        {/* Reusable ShowMore Component */}
        <ShowMore
          onClick={handleShowMore}
          hasMore={hasMore}
          label="Show More Related Products"
        />

      </div>
    </section>
  );
}
