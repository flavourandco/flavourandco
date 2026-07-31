import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import Link from "next/link";
import StoryTimeline from "@/components/StoryTimeline";
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
      hideHeader={true}
    >
      <div className="bg-cream pb-0">

        {/* Banner Section */}
        <div className="w-full relative h-48 md:h-64 lg:h-72 bg-[#07402b] flex items-center justify-center shadow-md">
          <div className="text-center px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c69c40] mb-2">
              Flavour &amp; Co.
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-medium leading-none">
              Our Story
            </h1>
            <p className="mt-3.5 text-xs sm:text-sm text-cream/70 max-w-xl mx-auto tracking-wide">
              More Than Food. A Story of Flavour and Connection.
            </p>
          </div>
        </div>

        {/* Section 1: Meet Simran (Overlapping Images Layout) */}
        <div id="meet-simran" className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8 scroll-mt-24">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20 items-center">
            {/* Left Column: Text content */}
            <div className="lg:col-span-6 text-left order-last lg:order-first">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30] mb-3">
                Meet Simran
              </p>

              <h2 className="font-serif text-4xl sm:text-4.5xl md:text-5xl text-brand-green leading-[1.1] font-semibold">
                More Than <span className="italic text-[#6b1e30]">Food</span>. <br />
                A Story of Flavour and Connection.
              </h2>

              <div className="text-[#6b1e30] mt-4 w-24">
                <SquiggleDivider />
              </div>

              <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-stone-600">
                <p>
                  For Simran, food has always been more than just something on the table — it’s how stories are shared, traditions are carried forward, and people are brought together.
                </p>

                <p className="font-serif italic text-lg text-brand-green leading-snug">
                  Raised in a home where recipes were passed down through generations, <span className="text-[#6b1e30] font-bold not-italic">she developed a deep appreciation for flavour, culture and the moments food creates.</span>
                </p>

                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold leading-relaxed">
                  BRINGING HERITAGE INTO A MODERN CONTEXT.
                </p>

                <p>
                  Today, as the face of Flavour &amp; Co, Simran brings that heritage into a modern context — reimagining familiar flavours into something refined, approachable and made for how we gather today.
                </p>
              </div>
            </div>

            {/* Right Column: Overlapping images */}
            <div className="lg:col-span-6 relative pb-16 pr-10 order-first lg:order-last">
              <div className="relative aspect-[3/4] w-[88%] overflow-hidden shadow-xl border border-brand-gold/20 rounded-xl">
                <Image
                  src="/founder/simran-kitchen.jpg"
                  alt="Simran in her kitchen — Founder of Flavour & Co."
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                  quality={95}
                  priority
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[58%] aspect-[4/3] overflow-hidden shadow-xl border-[6px] border-cream rounded-xl">
                <Image
                  src="/products/PHOTOS_Flavour&Co-3.jpg"
                  alt="Crafting gourmet pies"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 500px"
                  quality={95}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Story Timeline Component */}
        <StoryTimeline />

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