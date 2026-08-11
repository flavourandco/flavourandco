import PageLayout from "@/components/layout/PageLayout";
import Image from "next/image";
import Link from "next/link";
import StoryTimeline from "@/components/story/StoryTimeline";
import PartnerLogosStrip from "@/components/home/PartnerLogosStrip";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Simran | Our Story | Flavour & Co.",
  description:
    "More than food — a story of flavour and connection. Learn how Simran brings heritage into a modern context with Flavour & Co.'s artisan pies.",
};

/**
 * Scalloped "pie crust" divider — signature motif for the green timeline band.
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

/** Highlighter-style tag — a solid block of color behind text. */
interface HighlightProps {
  tone?: "burgundy" | "gold";
  children: ReactNode;
  className?: string;
}

function Highlight({ tone = "burgundy", children, className = "" }: HighlightProps) {
  const tones: Record<NonNullable<HighlightProps["tone"]>, string> = {
    burgundy: "bg-[#6b1e30] text-cream",
    gold: "bg-[#c69c40] text-[#07402b] font-extrabold",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Angled garnet CTA button — slanted right edge. */
function GarnetButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-2 bg-[#6b1e30] text-cream pl-8 pr-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] shadow-lg hover:bg-[#7d2438] transition-colors duration-300"
      style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)" }}
    >
      {children} <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

export default function OurStoryPage() {
  return (
    <PageLayout
      title="Our Story"
      subtitle="More Than Food. A Story of Flavour and Connection."
      fullWidth
    >
      <div className="bg-cream pb-0">

        {/* Section 1: Meet Simran (Overlapping Images Layout) */}
        <div id="meet-simran" className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8 scroll-mt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20 items-stretch">
            {/* Left Column: Text content */}
            <div className="lg:col-span-6 text-left order-last lg:order-first flex flex-col justify-between">
              <div>
                {/* Main Headline in Gold with Garnet period */}
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#c69c40] font-normal leading-[1.1] tracking-tight">
                  More Than Food<span className="text-[#6b1e30] font-bold">.</span>
                </h2>

                {/* Credentials / Sub-tag line with sharp gray highlight background */}
                <div className="mt-4 mb-6 inline-block bg-[#e5e1d8] rounded-none px-2.5 sm:px-3 py-1.5 max-w-full">
                  <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.3em] font-bold leading-none whitespace-nowrap">
                    <span className="text-[#6b1e30]">HERITAGE</span>
                    <span className="text-[#c69c40] mx-1.5 sm:mx-2.5 text-xs sm:text-sm">•</span>
                    <span className="text-[#6b1e30]">FLAVOUR &amp; CONNECTION</span>
                  </p>
                </div>
              </div>

              {/* Story text with editorial serif italics matching reference */}
              <div className="space-y-5 font-serif text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                <p className="italic text-lg sm:text-xl text-stone-800 leading-snug">
                  “For Simran, food has always been more than just something on the table — it’s how stories are shared, traditions are carried forward, and people are brought together.”
                </p>

                <p>
                  Raised in a home where recipes were passed down through generations, she developed a deep appreciation for flavour, culture and the moments food creates.
                </p>

                <p>
                  Today, as the face of Flavour &amp; Co, Simran brings that heritage into a modern context — reimagining familiar flavours into something refined, approachable and made for how we gather today.
                </p>
              </div>
            </div>

            {/* Right Column: Simran Photo with "Meet Simran" directly above it */}
            <div className="lg:col-span-6 order-first lg:order-last flex flex-col items-center lg:items-start justify-start h-full">
              {/* Subtitle with Garnet Dot directly above the photo */}
              <div className="w-full max-w-md flex items-center gap-2.5 mb-3 shrink-0">
                <span className="h-2 w-2 rounded-full bg-[#6b1e30] shrink-0" />
                <p className="font-serif italic text-stone-800 text-2xl sm:text-3xl font-normal">
                  Meet Simran
                </p>
              </div>

              <div className="relative w-full max-w-md flex-1 min-h-[380px] sm:min-h-[450px] overflow-hidden shadow-xl border border-brand-gold/20 rounded-xl">
                <Image
                  src="/founder/simran-kitchen.jpg"
                  alt="Simran in her kitchen — Founder of Flavour & Co."
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  quality={95}
                  priority
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Story Timeline Component */}
        <StoryTimeline />

        {/* Section 2.5: Where We're Already Trusted */}
        <section className="w-full bg-[#fdf8f3] py-16 md:py-24 border-t border-b border-[#ebe3d8]">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30] block mb-2">
              Proven Foodservice &amp; Venue Partners
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410] mb-4">
              WHERE WE&apos;RE ALREADY TRUSTED
            </h2>
            <p className="text-xs sm:text-sm text-[#1c1410]/75 max-w-2xl mx-auto mb-8">
              Flavour &amp; Co. products are currently served across 5-star hotels, banquets, buffets, and premier venue catering:
            </p>

            {/* Hotel Partners Logo Strip */}
            <PartnerLogosStrip title="" className="mb-12 rounded-2xl border-0 py-4" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/fullerton-hotel.svg" alt="The Fullerton Hotel Sydney" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">5-Star Hotel</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">The Fullerton Hotel Sydney</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Banquet pies, breakfast buffet items, and Chicken Tikka Samosas (bar menu).
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/hyatt-regency.svg" alt="Hyatt Regency Sydney" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">5-Star Hotel</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">Hyatt Regency Sydney</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Event banquet supply, function menu pies, and breakfast items.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/sheraton-grand.svg" alt="Sheraton Grand Sydney Hyde Park" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">5-Star Hotel</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">Sheraton Grand Sydney</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Banquet pies and event foodservice supply.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/amora-hotel.svg" alt="Amora Hotel Jamison Sydney" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">5-Star Hotel</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">Amora Hotel Jamison</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Pies and gluten-free South Asian breakfast items.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/novotel.svg" alt="Novotel Sydney Darling Harbour" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">Harbour Venue</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">Novotel Sydney</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Canapés for cocktail and function menus.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/parkroyal.svg" alt="PARKROYAL Parramatta" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">5-Star Hotel</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">PARKROYAL Parramatta</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Pies and breakfast items.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/channel-7.svg" alt="Channel 7 Plate of Origin" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">National TV</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">Channel 7</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Featured Simran&apos;s signature recipes on Plate of Origin.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c69c40]/25 shadow-sm space-y-3 text-left flex flex-col justify-between transition-all hover:border-[#c69c40]/50 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="relative h-6 w-24 shrink-0 opacity-90">
                      <Image src="/partners/corporate-catering.svg" alt="Corporate Catering Partners" fill className="object-contain object-left" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b1e30] bg-[#6b1e30]/10 px-2.5 py-1 rounded-md shrink-0">Catering</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1c1410]">Corporate Catering</h3>
                  <p className="text-xs text-[#1c1410]/75 leading-relaxed mt-1">
                    Full gourmet pie range, mini canapés, and grazing formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Approach (Dark Inset Background) */}
        <div className="relative overflow-hidden py-24 md:py-32 w-full bg-[#1c1410] text-white">
          {/* Subtle Dark Inset Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/products/PHOTOS_Flavour&Co-4.jpg"
              alt="Flavour & Co. Gourmet background"
              fill
              className="object-cover opacity-50"
              sizes="100vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c1410] via-[#1c1410]/70 to-[#1c1410] shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c69c40] mb-3">
              Our Approach
            </p>

            <h2 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl text-white leading-[1.15] font-semibold">
              Balancing <span className="italic text-[#c69c40]">Heritage</span> &amp; Innovation
            </h2>

            <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-white/85 max-w-2xl mx-auto font-sans">
              <p className="font-semibold text-white text-lg sm:text-xl">
                At Flavour &amp; Co, we believe great flavour comes from a balance of heritage and innovation.
              </p>
              <p>
                Inspired by recipes passed down through generations, our pies bring together bold, nostalgic flavours with a refined, modern approach.
              </p>
              <p className="text-white/90 font-medium">
                Every product is crafted with care, designed to deliver consistency, quality and a food experience that feels both familiar and elevated — whether it&apos;s shared at home or served at scale.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
              {["Heritage", "Craft", "Consistency"].map((value, i) => (
                <span key={value} className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#c69c40]">
                  {i > 0 && <span className="h-1.5 w-1.5 rounded-full bg-[#c69c40]" />}
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