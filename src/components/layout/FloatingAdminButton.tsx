"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Custom SVG matching the Shield User icon
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

  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;
  const isAdmin = isLoaded && isSignedIn && role === "admin";

  // Do not render inside admin dashboard pages or if user is not admin
  if (pathname?.startsWith("/admin") || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center justify-end">
      <Link
        href="/admin/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        title="Admin Panel"
        aria-label="Admin Panel"
        className="group flex items-center bg-slate-950 hover:bg-black text-white p-3.5 rounded-full shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 border border-slate-800/80 cursor-pointer"
      >
        {/* Shield Icon */}
        <div className="w-[22px] h-[22px] flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors duration-300 shrink-0">
          <AdminShieldIcon className="w-[22px] h-[22px]" />
        </div>

        {/* Text revealed smoothly on hover; collapses on mouse leave */}
        <span className="max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2.5 group-hover:mr-1 whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold tracking-wider font-sans text-slate-100">
          Admin Panel
        </span>
      </Link>
    </div>
  );
}
