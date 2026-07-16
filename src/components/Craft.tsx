import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { craftFeatures } from "@/lib/data";

export default function Craft() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 md:py-32">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_#C9A962_0%,_transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
              The Craft
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-white md:text-5xl">
              Where Heritage Meets{" "}
              <span className="italic text-gold-light">Modern</span> Artistry
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/60">
              Every pie begins with a story — a grandmother&apos;s spice blend,
              a Sunday family gathering, a flavour that transports you home. We
              honour those traditions while crafting something entirely new.
            </p>
            <Link
              href="/our-story"
              className="group mt-8 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-gold transition-colors hover:text-gold-light"
            >
              Discover Our Story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
              alt="Baker crafting artisan pies"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        <div className="mt-20 grid gap-px bg-white/10 md:grid-cols-3">
          {craftFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-charcoal p-8 md:p-10"
            >
              <div className="mb-4 h-px w-8 bg-gold" />
              <h3 className="font-serif text-xl text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
