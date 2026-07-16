"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { media } from "@/lib/media";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setScrolled(!isHome || window.scrollY > 40);
  }, [isHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(!isHome || window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || mobileOpen
            ? "bg-brand-green shadow-lg backdrop-blur-xl py-2"
            : "bg-transparent py-4"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 relative">
          {/* Left Section: Profile/User Icon and optionally Desktop Links */}
          <div className="flex items-center gap-6 z-10">
            <Link
              href="/login"
              className="text-white hover:text-brand-gold transition-colors p-2 flex items-center justify-center"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            
            {/* Desktop Navigation Links - Left side */}
            <ul className="hidden items-center gap-6 lg:flex">
              {navLinks.slice(1, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative text-[11px] font-bold uppercase tracking-[0.15em] text-cream/90 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Logo - Image Branding */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105 z-10"
          >
            <img
              src={media.logo}
              alt="Flavour & Co. Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Right Section: Desktop Links, Cart Icon, and Hamburger */}
          <div className="flex items-center gap-4 z-10">
            {/* Desktop Navigation Links - Right side */}
            <ul className="hidden items-center gap-6 lg:flex mr-2">
              {navLinks.slice(4, 7).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative text-[11px] font-bold uppercase tracking-[0.15em] text-cream/90 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cart Icon - Just Icon, no border, no bg */}
            <Link
              href="/shop"
              className="relative text-cream hover:text-brand-gold transition-colors p-2 flex items-center justify-center"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-brand-green">
                0
              </span>
            </Link>
            
            {/* Hamburger Button */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white hover:text-brand-gold transition-colors p-2 flex items-center justify-center"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-brand-green pt-28 lg:hidden flex flex-col justify-between px-6 pb-12">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-brand-gold/10 py-4 font-serif text-2xl text-cream/90 transition-colors hover:text-brand-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-widest text-brand-gold"
              >
                <User className="h-4 w-4" />
                Log In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
