"use client";

import Image from "next/image";

export const PARTNER_LOGOS = [
  { name: "The Fullerton Hotel Sydney", src: "/partners/fullerton-hotel.svg" },
  { name: "Hyatt Regency Sydney", src: "/partners/hyatt-regency.svg" },
  { name: "Sheraton Grand Sydney Hyde Park", src: "/partners/sheraton-grand.svg" },
  { name: "Amora Hotel Jamison Sydney", src: "/partners/amora-hotel.svg" },
  { name: "Novotel Sydney Darling Harbour", src: "/partners/novotel.svg" },
  { name: "PARKROYAL Parramatta", src: "/partners/parkroyal.svg" },
  { name: "Cruzing Catering & Events Management", src: "/partners/cruzing.png" },
  { name: "Channel 7 Plate of Origin", src: "/partners/channel-7.svg" },
  { name: "Corporate Catering Partners", src: "/partners/corporate-catering.svg" },
];

interface PartnerLogosStripProps {
  eyebrow?: string;
  heading?: string;
  className?: string;
}

export default function PartnerLogosStrip({
  eyebrow = "PARTNERED HOTELS & BRANDS",
  heading = "Where We Are Trusted",
  className = "",
}: PartnerLogosStripProps) {
  return (
    <section className={`w-full bg-[#f7efe6] py-14 md:py-20 border-y border-[#ebe3d8] ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-12">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30] block">
          {eyebrow}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410]">
          {heading}
        </h2>
      </div>

      {/* Static Responsive Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 items-center justify-items-center">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="bg-white/80 hover:bg-white border border-[#ebe3d8] rounded-xl p-6 w-full h-28 sm:h-32 flex items-center justify-center shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
              title={logo.name}
            >
              <div className="relative w-full h-full">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
