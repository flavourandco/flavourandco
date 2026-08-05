"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X, ArrowRight, ChevronRight, HelpCircle, LogIn, UserPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { navLinks, products } from "@/lib/data";
import { media } from "@/lib/media";

import AnnouncementBar from "./AnnouncementBar";

export default function HomeNavbar() {
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || user?.username || "there";
  const userInitial = (firstName[0] || "U").toUpperCase();

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  const filteredProducts = searchQuery.trim()
    ? products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const popularSearches = ["Butter Chicken Pie", "Keema Lamb Pie", "Veggie Samosa", "Family Pack", "Dessert Tart"];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] bg-base-100 shadow-sm border-b border-secondary/15 transition-all duration-300">
        {/* Top Announcement Bar with PageHeader Aesthetic */}
        <AnnouncementBar />

        {/* Unified Header Bar */}
        <div className="mx-auto max-w-[1400px]">
          {/* MOBILE VIEW NAVBAR (md:hidden) */}
          <div className="flex md:hidden items-center justify-between px-4 py-2 relative min-h-[64px] sm:min-h-[72px]">
            {/* Left: Mobile Profile & Search Icons */}
            <div className="flex items-center gap-1 text-primary z-10">
              {isLoaded && isSignedIn ? (
                <Link
                  href="/profile"
                  className="flex items-center p-1 cursor-pointer"
                  aria-label="Profile"
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={firstName}
                      className="h-7 w-7 rounded-full object-cover border border-brand-gold"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-brand-green text-brand-gold flex items-center justify-center font-bold text-xs">
                      {userInitial}
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="p-1.5 hover:text-secondary transition-colors cursor-pointer"
                  aria-label="Log in"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 hover:text-secondary transition-colors cursor-pointer"
                aria-label="Open search drawer"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0 transition-transform duration-300 hover:scale-105 z-10 py-1 px-3 block"
            >
              <img
                src={media.navbarLogo}
                alt="Flavour & Co. Logo"
                className="h-[40px] sm:h-[46px] w-auto object-contain"
              />
            </Link>

            {/* Right: Cart & Hamburger Menu */}
            <div className="flex items-center gap-0.5 text-primary z-10">
              <Link
                href="/shop"
                className="relative p-1.5 hover:text-secondary transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-secondary-content">
                  0
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1.5 hover:text-secondary transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW NAVBAR (hidden md:flex) */}
          <div className="hidden md:flex items-center justify-between px-6 lg:px-10 py-1 gap-6">
            {/* Left: Brand Logo */}
            <Link href="/" className="shrink-0 transition-transform duration-300 hover:scale-105 py-1.5 px-3 block">
              <img
                src={media.navbarLogo}
                alt="Flavour & Co. Logo"
                className="h-13 lg:h-15 xl:h-16 w-auto object-contain max-h-20"
              />
            </Link>

            {/* Center: Navigation Links */}
            <nav className="flex items-center gap-6 lg:gap-8">
              <ul className="flex items-center gap-6 lg:gap-8 text-sm lg:text-base font-extrabold uppercase tracking-wider">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`transition-colors pb-1 ${pathname === link.href ? "text-primary font-black border-b-2 border-primary" : "text-primary/80 hover:text-primary font-extrabold"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right: Actions & Auth Buttons */}
            <div className="flex items-center gap-3 sm:gap-5 text-brand-green">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-stone-700 hover:text-brand-green transition-colors cursor-pointer"
                aria-label="Open search drawer"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/shop"
                className="relative p-1.5 text-stone-700 hover:text-brand-green transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-extrabold text-brand-green shadow-xs">
                  0
                </span>
              </Link>

              {/* Minimal Authentication Buttons / User Profile */}
              {isLoaded && isSignedIn ? (
                <Link
                  href="/profile"
                  className="ml-1 flex items-center gap-2 py-1 px-1 rounded-full hover:opacity-80 transition-all cursor-pointer"
                  title="View Profile"
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={firstName}
                      className="h-8 w-8 rounded-full object-cover shadow-xs"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand-green text-brand-gold flex items-center justify-center font-bold text-xs shadow-xs">
                      {userInitial}
                    </div>
                  )}
                  <div className="hidden lg:flex flex-col text-left leading-none text-stone-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Hey,</span>
                    <span className="text-xs font-extrabold tracking-tight">{firstName}</span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <Link
                    href="/sign-in"
                    className="text-xs font-extrabold uppercase tracking-wider text-stone-700 hover:text-brand-green transition-colors cursor-pointer"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-full bg-brand-green text-white hover:bg-brand-gold hover:text-brand-green transition-all shadow-xs cursor-pointer inline-block"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Redesigned Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-[150] md:hidden transition-all duration-300 ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sliding Sidebar Panel */}
        <aside
          className={`fixed inset-y-0 right-0 z-[160] w-[88%] max-w-sm bg-base-100 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out transform ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Top Section */}
          <div>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-5 border-b border-secondary/15">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <img
                  src={media.navbarLogo}
                  alt="Flavour & Co. Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-base-200 text-primary transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 block mb-2">
                Menu & Exploration
              </span>
              <ul className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between py-3 px-3 rounded-none text-sm font-bold uppercase tracking-wider transition-all ${isActive
                          ? "bg-secondary/15 text-secondary border-l-4 border-secondary pl-4"
                          : "text-primary hover:bg-base-200 hover:text-secondary hover:pl-4"
                          }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className={`h-4 w-4 ${isActive ? "text-secondary" : "opacity-40"}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 border-t border-secondary/15 mt-8 space-y-4">
            {/* Auth Buttons / Account Details */}
            {isLoaded && isSignedIn ? (
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2 px-1 text-brand-green hover:opacity-80 transition-all"
              >
                <div className="flex items-center gap-3">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={firstName} className="h-8 w-8 rounded-full object-cover shadow-xs" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand-green text-brand-gold flex items-center justify-center font-bold text-xs">
                      {userInitial}
                    </div>
                  )}
                  <div className="text-left flex flex-col leading-none text-brand-green">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Hey,</span>
                    <span className="text-xs font-extrabold tracking-tight">{firstName}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-brand-green" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-brand-green bg-white text-xs font-bold uppercase tracking-wider text-brand-green hover:bg-brand-green/10 transition-all rounded-md cursor-pointer text-center"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-green text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-green transition-all shadow-sm cursor-pointer text-center"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 border border-secondary/20 bg-base-200 text-xs font-bold uppercase tracking-wider text-primary hover:border-secondary transition-all rounded-md"
              >
                <HelpCircle className="h-4 w-4 text-secondary" />
                Help & FAQ
              </Link>
            </div>

            {/* Handcrafted Tagline */}
            <div className="text-center">
              <p className="font-serif text-xs italic text-primary/70">
                Handcrafted Pies • Express Delivery
              </p>
              <p className="text-[10px] text-primary/40 uppercase tracking-widest mt-1">
                Flavour & Co. Artisanal Bakery
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Slide-Over Search Drawer */}
      <div
        className={`fixed inset-0 z-[200] overflow-hidden transition-all duration-300 ${searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setSearchOpen(false)}
        />

        {/* Slide-Over Drawer Panel */}
        <aside
          className={`fixed inset-y-0 right-0 z-[210] flex w-full md:w-1/2 max-w-xl bg-base-100 p-6 sm:p-10 shadow-2xl flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out transform ${searchOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-secondary/20">
              <h3 className="font-serif text-2xl font-bold text-primary">
                Search <span className="italic text-secondary">Flavour & Co.</span>
              </h3>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-base-200 text-primary transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Input Box */}
            <div className="mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pies, grazing packs, recipes..."
                  className="w-full rounded-none border-2 border-secondary/40 bg-base-200 px-5 py-4 pl-12 text-sm sm:text-base text-base-content placeholder:text-base-content/50 focus:border-secondary focus:outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
              </div>
            </div>

            {/* Suggested Tags */}
            <div className="mt-6">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-60 text-primary">
                Popular Searches
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-none border border-secondary/30 bg-base-200 px-3 py-1.5 text-xs font-semibold text-primary hover:border-secondary hover:bg-secondary hover:text-secondary-content transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.trim() !== "" && (
              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                  Matching Products ({filteredProducts.length})
                </h4>
                {filteredProducts.length > 0 ? (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href="/shop"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 rounded-none border border-secondary/15 bg-base-200 p-3 hover:border-secondary transition-all"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 object-cover shrink-0"
                        />
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-primary">{product.name}</h5>
                          <p className="text-xs opacity-75 line-clamp-1">{product.description}</p>
                          <span className="text-xs font-bold text-secondary mt-0.5 block">
                            ${product.price.toFixed(2)} AUD
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-secondary shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-60 italic">No pies or products match &ldquo;{searchQuery}&rdquo;.</p>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 mt-8 border-t border-secondary/15 flex items-center justify-between text-xs opacity-70">
            <span>Handcrafted Gourmet Pies</span>
            <Link
              href="/shop"
              onClick={() => setSearchOpen(false)}
              className="font-bold text-secondary hover:underline uppercase tracking-wider"
            >
              View Full Menu →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
