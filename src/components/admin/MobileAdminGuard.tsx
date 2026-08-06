"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Monitor, ArrowLeft, ShieldAlert, Laptop } from "lucide-react";
import { media } from "@/lib/media";

interface MobileAdminGuardProps {
  children: React.ReactNode;
  isMobileServer?: boolean;
}

export default function MobileAdminGuard({
  children,
  isMobileServer = false,
}: MobileAdminGuardProps) {
  const [isMobileClient, setIsMobileClient] = useState<boolean | null>(
    isMobileServer ? true : null
  );

  useEffect(() => {
    const checkMobile = () => {
      // Screen width under 1024px or user agent matching mobile
      const widthMobile = window.innerWidth < 1024;
      const uaMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobileClient(widthMobile || uaMobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // During initial SSR hydration, if server already detected mobile, show mobile block immediately
  const isMobile = isMobileClient ?? isMobileServer;

  if (isMobile) {
    return (
      <div className="admin-scope min-h-screen bg-[#0c1017] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none font-sans">
        {/* Background Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-700/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 flex flex-col items-center text-center">
          {/* Logo Header */}
          <div className="mb-8">
            <img
              src={media.navbarLogo}
              alt="Flavour & Co."
              className="h-16 w-auto object-contain mx-auto brightness-200 contrast-125"
            />
          </div>

          {/* Card Container */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold uppercase tracking-wider mb-6">
              <ShieldAlert className="w-3.5 h-3.5" />
              Desktop Access Only
            </div>

            {/* Laptop / Monitor Graphic */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-inner relative">
                <Laptop className="w-10 h-10 text-amber-400" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-600 border-2 border-slate-900 flex items-center justify-center">
                  <Monitor className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Title & Headline */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
              Only Accessible on PC or Desktop
            </h1>
            <p className="text-amber-400/90 font-medium text-xs sm:text-sm mb-4">
              Flavour &amp; Co. Admin Portal
            </p>

            {/* Description */}
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
              For security, complete layout optimization, and operations management, the admin dashboard is intentionally disabled on mobile devices. Please log in from a PC or desktop computer.
            </p>

            {/* Action Button */}
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider cursor-pointer active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Main Website
            </Link>
          </div>

          {/* Security Footer Note */}
          <div className="mt-8 text-center text-[10px] font-mono text-slate-500 tracking-wider">
            FLAVOUR &amp; CO. ADMIN SECURITY SYSTEM &bull; PROTECTED ROUTE
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
