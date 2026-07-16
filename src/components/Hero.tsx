import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1607927152946-9009ec421e41?w=1920&q=80"
          alt="Artisan bakery kitchen"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/75 to-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/30" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold" />
            Indo-Fusion Artisan Bakery
          </p>

          <h1 className="font-serif text-5xl font-light leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            Premium Pies,{" "}
            <span className="italic text-gold-light">Crafted</span> for How We
            Gather Today
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/75">
            Inspired by generations of recipes, our small-batch Indo-fusion pies
            bring bold flavour to every table — from intimate dinners to
            effortless entertaining.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-gold px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/25"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/our-story"
              className="inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.15em] text-white transition-all hover:border-white hover:bg-white/10"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-white/15 pt-8">
          {[
            { value: "100%", label: "Handcrafted" },
            { value: "12+", label: "Signature Flavours" },
            { value: "4.9★", label: "Customer Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl text-gold-light md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
