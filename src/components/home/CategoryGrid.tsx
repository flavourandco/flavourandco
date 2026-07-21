"use client";

import Link from "next/link";
import Image from "next/image";
import { media } from "@/lib/media";

const categories = [
  {
    title: "Butter Chicken Pies",
    image: media.products.butterChicken,
    count: "4 Products",
    href: "/shop?category=butter-chicken",
  },
  {
    title: "Keema Lamb Pies",
    image: media.products.lambKeema,
    count: "3 Products",
    href: "/shop?category=keema-lamb",
  },
  {
    title: "Samosa Veggie Pies",
    image: media.products.samosaPie,
    count: "3 Products",
    href: "/shop?category=samosa",
  },
  {
    title: "Paneer Tikka Pies",
    image: media.products.paneerTikka,
    count: "2 Products",
    href: "/shop?category=paneer",
  },
  {
    title: "Family Bundles",
    image: media.moods.gather,
    count: "5 Offers",
    href: "/shop?category=bundles",
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-warm-white py-14 border-b border-brand-gold/15">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold">
            Explore Collection
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-brand-green tracking-tight font-medium">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group flex flex-col items-center text-center rounded-2xl bg-white p-4 border border-brand-gold/20 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-brand-green/0 transition-colors duration-300 group-hover:bg-brand-green/10" />
              </div>
              <h3 className="mt-4 font-serif text-base font-medium text-brand-green leading-snug group-hover:text-brand-gold transition-colors">
                {cat.title}
              </h3>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-charcoal/40">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
