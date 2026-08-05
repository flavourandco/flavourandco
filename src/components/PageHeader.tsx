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
      className={`border-b border-brand-gold/20 bg-brand-green h-44 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden flex items-center justify-center w-full px-4 text-center ${className}`}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-brand-gold blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center lg:px-8 relative z-10 w-full">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold mb-1 sm:mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-white font-medium leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm text-cream/70 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
