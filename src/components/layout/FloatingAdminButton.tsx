"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";

// Custom SVG matching the uploaded Shield User icon
function AdminShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5L4.5 6v5.8c0 5.4 3.7 10.3 7.5 11.7 3.8-1.4 7.5-6.3 7.5-11.7V6L12 2.5zM12 7.2a2.3 2.3 0 100 4.6 2.3 2.3 0 000-4.6zm-4.2 8.2c0-1.8 1.9-3 4.2-3s4.2 1.2 4.2 3c0 1.2-1.9 2-4.2 2s-4.2-.8-4.2-2z"
      />
    </svg>
  );
}

export default function FloatingAdminButton() {
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const [scrolled, setScrolled] = useState(false);

  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  const isAdmin = isLoaded && isSignedIn && role === "admin";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Do not render floating admin button inside admin dashboard pages or if not admin
  if (pathname?.startsWith("/admin") || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      {/* Scroll to Top Button (Clean matte amber, smooth 500ms spring-like animation) */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className={`group flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-2xl active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          scrolled
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto hover:scale-105"
            : "opacity-0 scale-75 translate-y-6 pointer-events-none absolute"
        }`}
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      </button>

      {/* Admin Button (Clean matte dark slate-950, borderless, silky smooth 500ms uncollapse transition) */}
      <Link
        href="/admin/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        title="Admin Panel"
        aria-label="Admin Panel"
        className={`group flex items-center bg-slate-950 hover:bg-black text-white p-3.5 rounded-full shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          scrolled
            ? "opacity-0 scale-75 translate-y-6 pointer-events-none absolute"
            : "opacity-100 scale-100 translate-y-0 pointer-events-auto hover:scale-105"
        }`}
      >
        {/* Shield Icon */}
        <div className="w-[22px] h-[22px] flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors duration-500 shrink-0">
          <AdminShieldIcon className="w-[22px] h-[22px]" />
        </div>

        {/* Text revealed smoothly on hover with a 500ms silky cubic-bezier easing */}
        <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 group-hover:mr-1.5 whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium tracking-wider font-sans text-slate-100">
          Admin Panel
        </span>
      </Link>
    </div>
  );
}
