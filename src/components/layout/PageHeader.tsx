import React from "react";

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export default function PageHeader({
  eyebrow = "Flavour & Co.",
  title,
  subtitle,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`ph-root relative w-full overflow-hidden border-b border-brand-gold/20 bg-brand-green ${className}`}
    >
      {/* base gradient + vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />

      {/* brushed texture */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay">
        <filter id="ph-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ph-grain)" />
      </svg>

      {/* hairline frame */}
      <div className="pointer-events-none absolute inset-x-6 top-3 hidden h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-x-6 bottom-3 hidden h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent sm:block" />

      <div className="relative z-10 flex h-44 w-full flex-col items-center justify-center px-4 text-center sm:h-56 md:h-64 lg:h-72">
        <div className="mx-auto w-full max-w-3xl">
          {eyebrow && (
            <div className="ph-eyebrow mb-3 flex items-center justify-center gap-3 sm:mb-4">
              <span className="ph-rule h-px flex-1 max-w-[64px] bg-brand-gold/50 origin-right" />
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-gold">
                <LeafGlyph />
                {eyebrow}
              </span>
              <span className="ph-rule h-px flex-1 max-w-[64px] bg-brand-gold/50 origin-left" />
            </div>
          )}

          <h1 className="ph-title font-serif text-3xl font-medium leading-tight tracking-tight text-white drop-shadow-[0_0_18px_rgba(198,161,91,0.18)] sm:text-4xl md:text-5xl">
            {title}
          </h1>

          <div className="ph-flourish mx-auto mt-3 flex items-center justify-center gap-2 sm:mt-4">
            <span className="h-px w-8 bg-brand-gold/40" />
            <span className="h-1 w-1 rotate-45 bg-brand-gold/70" />
            <span className="h-px w-8 bg-brand-gold/40" />
          </div>

          {subtitle && (
            <p className="ph-subtitle mx-auto mt-3 max-w-2xl text-xs tracking-wide text-cream/70 sm:mt-4 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <style>{`
        .ph-eyebrow, .ph-title, .ph-flourish, .ph-subtitle {
          opacity: 0;
          animation: ph-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .ph-eyebrow { animation-delay: 0.05s; }
        .ph-title { animation-delay: 0.18s; }
        .ph-flourish { animation-delay: 0.36s; transform-origin: center; }
        .ph-subtitle { animation-delay: 0.46s; }
        .ph-rule {
          transform: scaleX(0);
          animation: ph-rule-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.1s;
        }
        @keyframes ph-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ph-rule-in {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ph-eyebrow, .ph-title, .ph-flourish, .ph-subtitle, .ph-rule {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

function LeafGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-brand-gold">
      <path
        d="M12 2C7 4 4 9 4 14c0 4.5 3.5 8 8 8s8-3.5 8-8c0-5-3-10-8-12z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="rgba(198,161,91,0.12)"
      />
      <path d="M12 5v15" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}