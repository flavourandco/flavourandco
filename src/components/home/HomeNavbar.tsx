"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User, ArrowRight } from "lucide-react";
import { navLinks } from "@/lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { media } from "@/lib/media";

export default function HomeNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for header background & hide-on-scroll-down behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scrolled state
      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/Show behavior (only trigger if scrolled past 100px)
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down - hide
          setVisible(false);
        } else {
          // Scrolling up - show
          setVisible(true);
        }
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // GSAP animation for mobile menu items
  useGSAP(
    () => {
      if (mobileOpen) {
        gsap.to(".mobile-menu-overlay", {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.fromTo(
          ".mobile-link",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.1,
          }
        );
      } else {
        gsap.to(".mobile-menu-overlay", {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [mobileOpen], scope: menuRef }
  );

  return (
    <div ref={menuRef}>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled || mobileOpen
            ? "bg-brand-green shadow-lg backdrop-blur-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 lg:px-10 relative">
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
            <ul className="hidden items-center gap-8 md:flex">
              {navLinks.slice(1, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      scrolled || mobileOpen
                        ? "text-cream/90 hover:text-brand-gold"
                        : "text-cream/90 hover:text-white"
                    }`}
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
              className={`object-contain transition-all duration-300 ${
                scrolled || mobileOpen ? "h-10 md:h-12" : "h-12 md:h-14"
              } w-auto`}
            />
          </Link>

          {/* Right Section: Desktop Links, Cart Icon, and Hamburger */}
          <div className="flex items-center gap-4 z-10">
            {/* Desktop Navigation Links - Right side */}
            <ul className="hidden items-center gap-8 md:flex mr-2">
              {navLinks.slice(4, 7).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      scrolled || mobileOpen
                        ? "text-cream/90 hover:text-brand-gold"
                        : "text-cream/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cart Icon - Just Icon, no border, no bg */}
            <Link
              href="/shop"
              className="relative text-white hover:text-brand-gold transition-colors p-2 flex items-center justify-center"
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
              className="text-white hover:text-brand-gold transition-colors p-2 flex items-center justify-center"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay fixed inset-0 z-[90] flex items-center bg-brand-green px-8 pt-24 transition-opacity duration-300 md:px-16 ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1400px] grid gap-12 md:grid-cols-2">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`mobile-link block font-serif text-4xl text-cream/90 transition-colors hover:text-brand-gold md:text-5xl ${
                    pathname === link.href ? "italic text-brand-gold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-link hidden flex-col justify-end border-l border-brand-gold/20 pl-12 md:flex">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
              Ash & Simran
            </p>
            <h4 className="mt-4 font-serif text-2xl leading-snug text-cream">
              Great Tasting
              <br />
              Indo-Australian Pies
            </h4>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
              Created by Ash & Simran, representing Flavour & Co. on Channel 7&apos;s Plate of Origin. We bake our roots into every single pie.
            </p>
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="group mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold hover:text-white"
            >
              Shop Our Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
