"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => p.price <= maxPrice);

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, maxPrice, sortBy]);

  return (
    <section className="bg-cream pt-0 pb-16 md:pb-24">
      {/* Banner Image - Full Screen Width, Thinner Height, No Rounded Corners */}
      <div className="w-full relative h-48 md:h-64 lg:h-72 overflow-hidden shadow-md">
        <Image
          src="/product-page-banner.jpg"
          alt="Flavour & Co. Product Selection Banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07402b]/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
        {/* Main Header */}
        <div className="text-left mb-10 pb-6 border-b border-[#c69c40]/25">
          <h1 className="font-serif text-3xl md:text-4xl text-brand-green font-bold uppercase tracking-wider">
            All Products
          </h1>
        </div>

        {/* 2-Column Grid: Sidebar (3 cols) + Product Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Mobile Filter Trigger */}
          <div className="lg:hidden flex items-center justify-between w-full mb-4 bg-white border border-brand-gold/25 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{isMobileFilterOpen ? "Hide Filters" : "Show Filters"}</span>
            </button>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              {filteredProducts.length} Products
            </span>
          </div>

          {/* Left Column: Filter Sidebar */}
          <aside className={`lg:col-span-3 lg:sticky lg:top-32 space-y-8 ${isMobileFilterOpen ? "block" : "hidden lg:block"} bg-white p-6 rounded-lg border border-brand-gold/25 shadow-sm`}>
            
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/15">
              <h3 className="font-serif text-xl text-brand-green font-semibold">Filter by</h3>
              <button 
                onClick={() => {
                  setSelectedCategory("all");
                  setMaxPrice(100);
                  setSortBy("recommended");
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-[#6b1e30] hover:text-brand-gold transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Price Filter */}
            <div className="pb-6 border-b border-brand-gold/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-4">Price (AUD)</h4>
              <input
                type="range"
                min="18"
                max="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-gold cursor-pointer"
              />
              <div className="flex justify-between items-center text-xs mt-2 text-stone-500 font-bold">
                <span>A$18</span>
                <span className="text-brand-green bg-[#6b1e30]/5 border border-[#6b1e30]/15 px-2.5 py-0.5 rounded font-mono">
                  Up to A${maxPrice}
                </span>
                <span>A$100</span>
              </div>
            </div>

            {/* Browse Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-4">Browse by</h4>
              <div className="space-y-2.5">
                {[
                  { id: "all", label: "All Products" },
                  { id: "freshly-baked", label: "Freshly Baked (Packs of 2)" },
                  { id: "frozen", label: "Frozen Party Packs (12s)" },
                  { id: "grazing-box", label: "Grazing Boxes" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left text-xs py-2.5 px-3.5 rounded-md transition-all duration-300 font-bold uppercase tracking-wider border ${
                      selectedCategory === cat.id
                        ? "bg-brand-green text-cream border-brand-green shadow-sm"
                        : "bg-white text-stone-600 border-brand-gold/15 hover:border-brand-gold hover:text-brand-green"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Column: Sorting Header + Product Cards Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Sorting Header (Desktop Only) */}
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-brand-gold/15">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Showing {filteredProducts.length} of {products.length} products
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-brand-gold/25 rounded-md py-1.5 pl-3 pr-8 text-xs font-bold uppercase tracking-wider text-brand-green focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-brand-gold/25 rounded-lg">
                <p className="text-stone-500 font-bold uppercase tracking-wider text-sm">
                  No products match your selected filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setMaxPrice(100);
                    setSortBy("recommended");
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand-green hover:bg-[#6b1e30] text-cream hover:text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
