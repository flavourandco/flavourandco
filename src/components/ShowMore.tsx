"use client";

import { ChevronDown, Loader2 } from "lucide-react";

interface ShowMoreProps {
  onClick: () => void;
  label?: string;
  hasMore?: boolean;
  loading?: boolean;
  className?: string;
}

export default function ShowMore({
  onClick,
  label = "Show More",
  hasMore = true,
  loading = false,
  className = "",
}: ShowMoreProps) {
  if (!hasMore) return null;

  return (
    <div className={`flex flex-col items-center justify-center my-2 sm:my-3 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="group inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b1e30] hover:text-[#07402b] bg-transparent border-0 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        aria-label={label}
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span className="relative">
              {label}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 opacity-60" />
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-current transition-transform duration-300 group-hover:translate-y-1" />
          </>
        )}
      </button>
    </div>
  );
}
