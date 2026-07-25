"use client";

import Image from "next/image";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function Products() {
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

        {/* All Product Cards Grid (No Sidebar, No Filters, No Pagination) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
