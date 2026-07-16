import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { products } from "@/lib/data";

export default function Products() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-brand-gold">
            Our Collection
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-brand-green md:text-5xl">
            Our Indo-Australian Pies
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-stone-500">
            Handcrafted fusion pies by Ash & Simran, showcased on Channel 7&apos;s Plate of Origin. Delivered Sydney-wide.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-stone-200/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 bg-brand-green/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold rounded-md">
                  {product.badge}
                </span>
                <button
                  type="button"
                  aria-label={`Add ${product.name} to cart`}
                  className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-4 items-center justify-center bg-brand-gold text-brand-green opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-brand-gold/90 rounded-md"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl text-brand-green md:text-2xl">
                    {product.name}
                  </h3>
                  <p className="shrink-0 font-medium text-brand-gold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-500">
                  {product.description}
                </p>
                <Link
                  href={`/shop/${product.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-brand-green transition-colors hover:text-brand-gold"
                >
                  View Details
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 border border-brand-green px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-brand-green transition-all hover:bg-brand-green hover:text-white rounded-md"
          >
            View All Products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
