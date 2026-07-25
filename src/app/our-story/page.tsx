import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Scalloped "pie crust" divider — signature motif for the green timeline band.
 * Uses `currentColor`, so pass a text-* color class on the wrapper.
 */
interface ScallopDividerProps {
  flip?: "down" | "up";
  className?: string;
}

function ScallopDivider({ flip = "down", className = "" }: ScallopDividerProps) {
  const cy = flip === "down" ? 0 : 20;
  return (
    <svg
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={i * 10 + 5} cy={cy} r="10" fill="currentColor" />
      ))}
    </svg>
  );
}

/** Thin hand-drawn wave divider, used under editorial headlines on cream sections. */
function SquiggleDivider({ className = "" }: { className?: string }) {
  const amplitude = 6;
  const period = 20;
  const width = 200;
  let d = `M0 10`;
  for (let x = 0; x < width; x += period) {
    d += ` Q ${x + period / 4} ${10 - amplitude}, ${x + period / 2} 10 Q ${x + (3 * period) / 4} ${10 + amplitude}, ${x + period} 10`;
  }
  return (
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" className={`block w-full ${className}`} aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Highlighter-style tag — a solid block of color behind text.
 * Both tones keep dark-on-light text, so contrast holds regardless of tone.
 */
interface HighlightProps {
  tone?: "burgundy" | "gold";
  children: ReactNode;
  className?: string;
}

function Highlight({ tone = "burgundy", children, className = "" }: HighlightProps) {
  const tones: Record<NonNullable<HighlightProps["tone"]>, string> = {
    burgundy: "bg-[#6b1e30] text-cream",
    gold: "bg-brand-gold/25 text-[#6b1e30]",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Angled garnet CTA button — slanted right edge, matches the homepage hero button. */
function GarnetButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-2 bg-[#6b1e30] text-cream pl-8 pr-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] shadow-lg hover:bg-[#7d2438] transition-colors duration-300"
      style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)" }}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

/** Quiet scroll-cue link — small caps label wrapped by squiggles, like the homepage hero. */
function ScrollCue({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex flex-col items-center text-[#6b1e30]">
      <SquiggleDivider className="h-2 w-16" />
      <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em]">{children}</span>
      <SquiggleDivider className="h-2 w-16 rotate-180" />
    </Link>
  );
}

export default function OurStoryPage() {
  return (
    <PageLayout
      title="Our Story"
      subtitle="Baking our roots into every single pie — Simran."
      fullWidth
      hideHeader={true}
    >
      <div className="bg-cream pb-0">
        {/* Custom Banner: Same height as shop banner, full screen width, green bg */}
        <div className="w-full relative h-48 md:h-64 lg:h-72 bg-[#07402b] flex items-center justify-center shadow-md">
          <div className="text-center px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c69c40] mb-2">
              Flavour &amp; Co.
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-medium leading-none">
              Our Story
            </h1>
            <p className="mt-3.5 text-xs sm:text-sm text-cream/70 max-w-xl mx-auto tracking-wide">
              Baking our roots into every single pie — Simran.
            </p>
          </div>
        </div>
        {/* Section 2: Our Founder */}
        <div id="our-founder" className="mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-24 md:pb-24 lg:px-8 scroll-mt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 relative aspect-[3/4] overflow-hidden shadow-xl">
              <Image
                src="/founder/simran-coloured.jpg"
                alt="Simran — Founder of Flavour & Co."
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <div className="lg:col-span-7 text-left">
              <p className="font-serif italic text-stone-500 text-base">Our Founder</p>
              <h2 className="mt-1 font-serif text-5xl md:text-6xl text-[#6b1e30] font-semibold">
                Simran
              </h2>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green">
                Founder &amp; Head Baker · Plate of Origin Finalist
              </p>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-stone-600">
                <p>
                  <span className="font-bold text-brand-green">
                    Before Simran became the face of Flavour &amp; Co, she was just a home cook
                  </span>{" "}
                  — someone who believed the best conversations happen over a plate of something homemade, and who couldn&apos;t understand why gourmet pies always seemed to leave heritage flavour behind.
                </p>
                <p>
                  In 2018, she started fusing the recipes she grew up with into classic buttery pastry, right in her own kitchen. Two years later, she carried those flavours onto Channel 7&apos;s Plate of Origin, representing India and winning judges over with dishes that tasted like home. By 2022, that home-kitchen project had become Flavour &amp; Co.
                </p>
                <p>
                  Today, Simran isn&apos;t just the founder — she&apos;s the reason every pie still tastes like someone&apos;s kitchen. Each one carries a little of her family&apos;s table with it, made for you to share at yours.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Section 3: Our Story */}
        <div id="our-story" className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8 scroll-mt-24">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20 items-center">
            {/* Left Column: Text content (6 cols) */}
            <div className="lg:col-span-6 text-left order-last lg:order-first">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30] mb-4">
                Our Story
              </p>
              
              <h2 className="font-serif text-4.5xl md:text-5xl text-brand-green leading-[1.1] font-semibold">
                Our <span className="italic text-[#6b1e30]">Story</span>
              </h2>

              <div className="text-[#6b1e30] mt-4 w-24">
                <SquiggleDivider />
              </div>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-stone-600">
                <p>
                  What began as a single family recipe in Simran&apos;s home kitchen has grown into something far greater: a table where heritage and craft meet. At Flavour &amp; Co, we bring together the flavours she grew up with and the standards of a modern bakery — handcrafted pies built for how people actually gather today.
                </p>
                
                <p className="font-serif italic text-lg text-brand-green leading-snug">
                  Because let&apos;s be honest: <span className="text-[#6b1e30] font-bold not-italic">not every pie is made the same way.</span>
                </p>

                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold leading-relaxed">
                  FLAVOUR &amp; CO ISN&apos;T JUST BAKING — WE&apos;RE KEEPING TRADITION ALIVE.
                </p>

                <p>
                  We blend recipes passed down through generations with the discipline of a modern kitchen, giving you pies built for real occasions — from Sunday lunches to large-scale catering. Whether you&apos;re stocking a café, catering an event, or picking up a treat for yourself, Flavour &amp; Co helps you bring people to the table, one pie at a time.
                </p>
              </div>

              <div className="mt-10">
                <GarnetButton href="/shop">Explore Our Products</GarnetButton>
              </div>
            </div>

            {/* Right Column: Overlapping images (6 cols) */}
            <div className="lg:col-span-6 relative pb-16 pr-10 order-first lg:order-last">
              <div className="relative aspect-[3/4] w-[88%] overflow-hidden shadow-xl border border-brand-gold/20">
                <Image
                  src="/products/PHOTOS_Flavour&Co-3.jpg"
                  alt="Crafting gourmet pies"
                  fill
                  className="object-cover animate-fadeIn"
                  sizes="(max-width: 1024px) 80vw, 32vw"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[58%] aspect-[4/3] overflow-hidden shadow-xl border-[6px] border-cream">
                <Image
                  src="/founder/simran-kitchen.jpg"
                  alt="Simran in her kitchen"
                  fill
                  className="object-cover animate-fadeIn"
                  sizes="(max-width: 1024px) 60vw, 22vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Horizontal Timeline, framed with a pie-crust crimp */}
        <div className="relative mt-8">
          <div className="text-cream">
            <ScallopDivider flip="down" className="h-4 md:h-6" />
          </div>

          <div className="bg-brand-green text-white py-16 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-gold/20 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
              <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold text-center mb-2">
                Our Journey
              </span>
              <h3 className="font-serif text-2xl md:text-3.5xl text-white text-center mb-16 font-semibold">
                How We Built the <span className="text-[#c69c40] italic font-medium">Brand</span>
              </h3>

              <div className="grid gap-8 md:grid-cols-4 relative">
                {/* Horizontal Connector Line on md/desktop */}
                <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-brand-gold/20 -z-0" />

                {(
                  [
                    {
                      year: "2018",
                      title: "The Spark",
                      copy: "Simran starts fusing her heritage recipes with classic buttery pastry, right in her home kitchen.",
                    },
                    {
                      year: "2020",
                      title: "Plate of Origin",
                      tag: "TV",
                      copy: "Represents India on Channel 7's national cooking show, winning judges over with bold, familial flavours.",
                    },
                    {
                      year: "2022",
                      title: "Official Launch",
                      copy: "Flavour & Co. launches, bringing gourmet pie packs to foodies across Sydney.",
                    },
                    {
                      year: "2024+",
                      title: "Wholesale",
                      copy: "Expanding into wholesale supply, corporate catering, and bulk orders for premium venues.",
                    },
                  ] satisfies { year: string; title: string; tag?: string; copy: string }[]
                ).map((item) => (
                  <div key={item.year} className="relative z-10 text-center flex flex-col items-center group">
                    <div className="h-14 w-14 rounded-full bg-brand-gold text-brand-green flex items-center justify-center font-bold text-sm border-4 border-brand-green shadow-md transition-transform duration-300 group-hover:scale-105">
                      {item.year}
                    </div>
                    <h4 className="mt-4 font-bold text-brand-gold text-sm tracking-wider uppercase flex items-center gap-2">
                      {item.title}
                      {item.tag && (
                        <Highlight tone="burgundy" className="text-[9px] tracking-wider py-[1px] normal-case">
                          {item.tag}
                        </Highlight>
                      )}
                    </h4>
                    <p className="mt-2 text-xs text-cream/70 max-w-[200px] leading-relaxed">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-cream">
            <ScallopDivider flip="up" className="h-4 md:h-6" />
          </div>
        </div>

        {/* Section 5: Our Approach */}
        <div className="relative overflow-hidden py-24 md:py-32 w-full">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/products/PHOTOS_Flavour&Co-4.jpg"
              alt="Flavour & Co. Gourmet Fusion background"
              fill
              className="object-cover blur-[12px] scale-105"
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30] bg-[#6b1e30]/5 px-3 py-1 rounded border border-[#6b1e30]/15 mb-4">
              Our Approach
            </span>

            <h2 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl text-brand-green leading-[1.15] font-extrabold">
              Balancing <Highlight tone="gold" className="italic font-bold">Heritage</Highlight> &amp; Innovation
            </h2>

            <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-stone-900 font-extrabold max-w-2xl mx-auto">
              <p>
                At Flavour &amp; Co, we believe great flavour comes from a balance of heritage and innovation.
              </p>
              <p>
                Inspired by recipes passed down through generations, our pies bring together bold, nostalgic flavours with a refined, modern approach.
              </p>
              <p>
                Every product is crafted with care, designed to deliver consistency, quality and a food experience that feels both familiar and elevated — whether it&apos;s shared at home or served at scale.
              </p>
            </div>

            {/* Value pills */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
              {["Heritage", "Craft", "Consistency"].map((value, i) => (
                <span key={value} className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#6b1e30]">
                  {i > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />}
                  {value}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <GarnetButton href="/shop">Explore Our Products</GarnetButton>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}