export default function AnnouncementBar() {
  return (
    <div className="relative z-[60] overflow-hidden bg-[#07402b] h-9 sm:h-10 flex items-center border-b border-[#E3A72B]/30 shadow-sm">
      {/* base gradient + vignette matching PageHeader */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#E3A72B]/20 blur-2xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-[#E3A72B]/15 blur-2xl" />

      {/* brushed texture matching PageHeader */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay">
        <filter id="ab-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ab-grain)" />
      </svg>

      {/* hairline gold frame borders matching PageHeader */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E3A72B]/40 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E3A72B]/40 to-transparent z-20" />

      {/* Desktop View: Static Highlighted Text with Uniform Gold Color */}
      <div className="hidden md:flex relative z-20 w-full items-center justify-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#E3A72B] drop-shadow-[0_0_14px_rgba(227,167,43,0.35)] px-4">
        <span>FREE EXPRESS SHIPPING</span>
        <span className="opacity-60">•</span>
        <span>ORDER ABOVE $200 TO AVAIL THE OFFER</span>
        <span className="opacity-60">•</span>
        <span>HANDCRAFTED GOURMET PIES</span>
      </div>

      {/* Mobile View: High-Visibility Rollover Loop */}
      <div className="md:hidden relative z-20 overflow-hidden w-full text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E3A72B] drop-shadow-[0_0_10px_rgba(227,167,43,0.3)]">
        <div className="animate-ticker flex whitespace-nowrap items-center">
          {[1, 2, 3].map((key) => (
            <span key={key} className="inline-flex items-center gap-2 px-4">
              <span>FREE EXPRESS SHIPPING</span>
              <span className="opacity-60">•</span>
              <span>ORDER ABOVE $200 TO AVAIL THE OFFER</span>
              <span className="opacity-60">•</span>
              <span>HANDCRAFTED GOURMET PIES</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
