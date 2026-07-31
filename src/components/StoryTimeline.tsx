"use client";

import Image from "next/image";
import media from "@/lib/media";

/** Squiggle divider for section heading */
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

/** Highlighter tag badge */
function HighlightTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-1.5 py-0.5 rounded-sm bg-[#c69c40] text-[#07402b] font-extrabold text-[9px] tracking-wider normal-case">
      {children}
    </span>
  );
}

export default function StoryTimeline() {
  const milestones = [
    {
      year: "2018",
      title: "The Spark",
      copy: "Simran starts combining her heritage recipes with classic buttery pastry, right in her home kitchen.",
      image: media.timeline.spark,
      isTopImage: true,
      color: "bg-[#6b1e30]",
    },
    {
      year: "2020",
      title: "Plate of Origin",
      tag: "TV",
      copy: "Represents India on Channel 7's national cooking show, winning judges over with bold, familial flavours.",
      image: media.timeline.plateOfOrigin,
      isTopImage: false,
      color: "bg-[#c69c40]",
    },
    {
      year: "2021",
      title: "My Team India",
      copy: "My Team India launches after the success of Team India bringing gourmet pies to foodies across Sydney.",
      image: media.timeline.myTeamIndia,
      isTopImage: true,
      color: "bg-[#6b1e30]",
    },
    {
      year: "2025+",
      title: "Wholesale & Expansion",
      copy: "More than just pies, we add additional South Asian Canapés and breakfast items expanding into wholesale supply.",
      image: media.timeline.wholesale,
      isTopImage: false,
      color: "bg-[#c69c40]",
    },
  ];

  return (
    <section className="bg-[#f8f3eb] text-stone-800 py-10 md:py-14 border-t border-b border-secondary/15 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header - Balanced gap */}
        <div className="text-center max-w-xl mx-auto mb-8 md:mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30]">
            Our History &amp; Growth
          </span>
          <h3 className="mt-1 font-serif text-3xl sm:text-4xl text-brand-green font-semibold">
            Our Journey &amp; <span className="text-[#6b1e30] italic font-medium">Milestones</span>
          </h3>
          <div className="text-[#6b1e30] mt-2 w-24 mx-auto opacity-70">
            <SquiggleDivider />
          </div>
        </div>

        {/* DESKTOP HORIZONTAL INFOGRAPHIC TIMELINE (Hidden on mobile) */}
        <div className="hidden lg:block relative my-4 h-[480px]">
          
          {/* Continuous Center Horizontal Axis Line (Fixed in exact vertical center) */}
          <div className="absolute top-1/2 left-[5%] right-[5%] h-[2.5px] bg-[#6b1e30]/30 -translate-y-1/2 z-0" />

          {/* 4 Milestones Columns */}
          <div className="grid grid-cols-4 gap-4 h-full relative z-10">
            {milestones.map((item) => (
              <div key={item.year} className="relative h-full flex flex-col justify-between items-center text-center">
                
                {/* Continuous Vertical Dashed Connector Line passing through 100% center of the column */}
                <div className="absolute top-16 bottom-16 left-1/2 -translate-x-1/2 w-[2px] border-l-2 border-dashed border-[#6b1e30]/40 z-0 pointer-events-none" />

                {/* Node Dot strictly on the 100% cross-section intersection of Horizontal & Vertical lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full ${
                      item.isTopImage ? "bg-[#6b1e30]" : "bg-[#c69c40]"
                    } border-3 border-[#f8f3eb] shadow-md flex items-center justify-center`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.isTopImage ? "bg-brand-gold" : "bg-[#07402b]"
                      }`}
                    />
                  </div>
                </div>

                {/* TOP HALF (Image if top, Text if bottom) */}
                <div className="relative z-10 h-[210px] flex flex-col justify-end items-center">
                  {item.isTopImage ? (
                    <div className="relative group">
                      <div className={`absolute -top-1.5 -right-1.5 w-32 h-32 rounded-full ${item.color} shadow-sm transition-transform duration-500 group-hover:scale-105`} />
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="135px"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[220px] pb-3 bg-[#f8f3eb] rounded-lg px-2">
                      <span className="font-serif text-3xl font-extrabold text-[#6b1e30] tracking-tight">
                        {item.year}
                      </span>
                      <h4 className="font-bold text-brand-green text-sm uppercase tracking-wider mt-1 flex items-center gap-1.5 justify-center">
                        {item.title}
                        {item.tag && <HighlightTag>{item.tag}</HighlightTag>}
                      </h4>
                      <p className="mt-1.5 text-xs text-stone-600 leading-relaxed font-sans">
                        {item.copy}
                      </p>
                    </div>
                  )}
                </div>

                {/* BOTTOM HALF (Text if top, Image if bottom) */}
                <div className="relative z-10 h-[210px] flex flex-col justify-start items-center">
                  {!item.isTopImage ? (
                    <div className="relative group pt-1">
                      <div className={`absolute -bottom-1.5 -left-1.5 w-32 h-32 rounded-full ${item.color} shadow-sm transition-transform duration-500 group-hover:scale-105`} />
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="135px"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[220px] pt-3 bg-[#f8f3eb] rounded-lg px-2">
                      <span className="font-serif text-3xl font-extrabold text-[#6b1e30] tracking-tight">
                        {item.year}
                      </span>
                      <h4 className="font-bold text-brand-green text-sm uppercase tracking-wider mt-1 flex items-center gap-1.5 justify-center">
                        {item.title}
                        {item.tag && <HighlightTag>{item.tag}</HighlightTag>}
                      </h4>
                      <p className="mt-1.5 text-xs text-stone-600 leading-relaxed font-sans">
                        {item.copy}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* MOBILE & TABLET VERTICAL RESPONSIVE INFOGRAPHIC TIMELINE */}
        <div className="lg:hidden relative space-y-8 max-w-lg mx-auto px-2 my-6">
          {/* Continuous Vertical Timeline Line Axis */}
          <div className="absolute left-[39px] top-6 bottom-6 w-[2.5px] bg-[#6b1e30]/30 z-0" />

          {milestones.map((item) => (
            <div key={item.year} className="relative z-10 flex items-start gap-4 sm:gap-6">
              {/* Left Column: Circular Cutout Node */}
              <div className="relative shrink-0 group">
                <div className={`absolute -top-1 -right-1 w-18 h-18 sm:w-20 sm:h-20 rounded-full ${item.color} shadow-sm`} />
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-white shadow-md z-10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </div>
              </div>

              {/* Right Column: Card with Date & Text */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary/15 shadow-sm flex-1 text-left space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-extrabold text-xl text-[#6b1e30]">
                    {item.year}
                  </span>
                  {item.tag && <HighlightTag>{item.tag}</HighlightTag>}
                </div>
                <h4 className="font-bold text-brand-green text-sm uppercase tracking-wider">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {item.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
