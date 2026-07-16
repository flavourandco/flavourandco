import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WholesaleCTA() {
  return (
    <section className="relative overflow-hidden bg-gold py-20 md:py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-charcoal blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
          Wholesale & Catering
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-white md:text-5xl">
          Elevate Your Menu with Our Pies
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
          Partner with us for wholesale orders, corporate catering, and event
          packages. Premium quality, reliable delivery, unforgettable flavour.
        </p>
        <Link
          href="/wholesale"
          className="group mt-8 inline-flex items-center gap-3 bg-charcoal px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-charcoal/90 hover:shadow-xl"
        >
          Explore Wholesale
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
