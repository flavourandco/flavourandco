"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { media } from "@/lib/media";

const recipes = [
  {
    title: "Golden Syrup & Cinnamon Glazed Pastry",
    category: "Baking Tips",
    rating: 5,
    reviews: 14,
    image: media.moods.unwind,
    href: "/blog",
  },
  {
    title: "Slow-Cooked Butter Chicken Filling Secrets",
    category: "Signature Recipes",
    rating: 5,
    reviews: 28,
    image: media.moods.celebrate,
    href: "/blog",
  },
  {
    title: "Crispy Samosa Pie & Mint Chutney Board",
    category: "Pairings",
    rating: 5,
    reviews: 19,
    image: media.moods.entertain,
    href: "/blog",
  },
];

export default function RecipeSection() {
  return (
    <section className="bg-cream py-16 md:py-24 border-b border-brand-gold/15">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold">
              Inspiration & Pairings
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-brand-green tracking-tight font-medium">
              Seasonal Recipes & Serving Ideas
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-green hover:text-brand-gold transition-colors"
          >
            See All Recipes
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <article
              key={recipe.title}
              className="group flex flex-col rounded-2xl bg-white overflow-hidden border border-brand-gold/20 transition-all duration-300 hover:border-brand-gold/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-warm-white">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-brand-green text-brand-gold text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-gold/20">
                  {recipe.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-gold mb-2">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{recipe.rating.toFixed(1)}</span>
                  <span className="text-charcoal/40 font-normal">({recipe.reviews} Reviews)</span>
                </div>

                <h3 className="font-serif text-xl font-medium text-brand-green leading-snug group-hover:text-brand-gold transition-colors flex-grow">
                  {recipe.title}
                </h3>

                <div className="mt-6 pt-4 border-t border-brand-gold/10">
                  <Link
                    href={recipe.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-colors"
                  >
                    Read Recipe
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
