"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, RefreshCw } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/store/product.store";
import { useUIStore } from "@/store/ui.store";
import { BoneyardProductCardSkeleton } from "@/components/ui/BoneyardSkeleton";
import { sortProductsByCustomOrder } from "@/lib/utils";

export default function Products() {
  const rawProducts = useProductStore((s) => s.products);
  const isFetching = useProductStore((s) => s.isFetching);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const addToast = useUIStore((s) => s.addToast);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const products = sortProductsByCustomOrder(rawProducts);

  const toggleWishlist = (id: string) => {
    const isCurrentlyWishlisted = wishlist.includes(id);
    setWishlist((prev) =>
      isCurrentlyWishlisted ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const prod = products.find((p) => p.id === id);
    const name = prod ? prod.name : "Item";
    if (isCurrentlyWishlisted) {
      addToast(`Removed ${name} from your wishlist`, "info");
    } else {
      addToast(`Saved ${name} to your wishlist!`, "success");
    }
  };

  const displayedProducts = showWishlistOnly
    ? products.filter((p) => wishlist.includes(p.id))
    : products;

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
        {/* Main Header with Wishlist Button on the opposite side */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#c69c40]/25">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-green font-bold uppercase tracking-wider">
            {showWishlistOnly ? "My Wishlist" : "All Products"}
          </h1>

          {/* Wishlist Button on the other side of All Products header */}
          <button
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              showWishlistOnly
                ? "bg-brand-green text-white shadow-xs"
                : "bg-white text-brand-green border border-brand-green/30 hover:border-brand-green hover:bg-brand-green/5"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                wishlist.length > 0 ? "fill-brand-gold text-brand-gold" : "text-brand-green"
              }`}
            />
            <span>
              {showWishlistOnly ? "Show All Products" : `Wishlist (${wishlist.length})`}
            </span>
          </button>
        </div>

        {/* Product Cards Grid */}
        {isFetching && displayedProducts.length === 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BoneyardProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        ) : showWishlistOnly ? (
          /* Wishlist Specific Empty State */
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-stone-200/60 p-8">
            <Heart className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-stone-700 mb-1">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              Click the heart icon on any product card to save your favorite pies here.
            </p>
            <button
              onClick={() => setShowWishlistOnly(false)}
              className="bg-brand-green text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-brand-gold hover:text-brand-green transition-all cursor-pointer"
            >
              Explore All Products
            </button>
          </div>
        ) : (
          /* Shop Catalog Empty State */
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-stone-200/60 p-8">
            <ShoppingBag className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
              No Products Available Currently
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
              We are handcrafting our next fresh batch of gourmet pies in our commercial kitchen. Please check back shortly or refresh the catalog.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => fetchProducts(true)}
                className="inline-flex items-center gap-2 bg-brand-green text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-brand-gold hover:text-brand-green transition-all cursor-pointer shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh Menu</span>
              </button>
              <Link
                href="/wholesale"
                className="text-stone-600 hover:text-brand-green text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Wholesale Inquiries
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
