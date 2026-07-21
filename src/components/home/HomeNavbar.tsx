"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X, ArrowRight } from "lucide-react";
import { navLinks, products } from "@/lib/data";
import { media } from "@/lib/media";

export default function HomeNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        {/* Top Announcement Bar */}
        <div className="bg-secondary py-1.5 px-4 text-center text-secondary-content text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
          Free Express Shipping on Orders Over $100 | Handcrafted Sydney-Wide
        </div>

        {/* Unified Single Header Bar */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between gap-6">
          {/* Left: Brand Logo */}
          <Link href="/" className="shrink-0 transition-transform duration-300 hover:scale-105">
            <img
              src={media.logo}
              alt="Flavour & Co. Logo"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* Center: Merged Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-6 lg:gap-8 text-xs font-bold uppercase tracking-[0.18em]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-secondary ${
                      pathname === link.href ? "text-secondary border-b-2 border-secondary pb-1" : "text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-primary">
            {/* Search Icon Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:text-secondary transition-colors"
              aria-label="Open search drawer"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Help Link */}
            <Link
              href="/contact"
              className="hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider hover:text-secondary transition-colors"
            >
              Help
            </Link>

            {/* Wishlist */}
            <Link
              href="/shop"
              className="p-2 hover:text-secondary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Account */}
            <Link
              href="/login"
              className="p-2 hover:text-secondary transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart Icon with badge */}
            <Link
              href="/shop"
              className="relative p-2 hover:text-secondary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-secondary-content">
                0
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 hover:text-secondary transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="fixed inset-x-0 top-[105px] bottom-0 z-50 bg-base-100 p-6 overflow-y-auto md:hidden border-t border-secondary/15">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3.5 text-xl font-bold uppercase tracking-wider text-primary border-b border-secondary/15 hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Slide-Over Search Drawer (Full width on Mobile, Half width on PC) */}
      <div
        className={`fixed inset-0 z-[200] overflow-hidden transition-all duration-300 ${
          searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
            searchOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSearchOpen(false)}
        />

        {/* Slide-Over Drawer Panel with Sliding Animation */}
        <aside
          className={`fixed inset-y-0 right-0 z-[210] flex w-full md:w-1/2 max-w-xl bg-base-100 p-6 sm:p-10 shadow-2xl flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out transform ${
            searchOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-secondary/20">
              <h3 className="font-fraunces text-2xl font-bold text-primary">
                Search <span className="italic text-secondary">Flavour & Co.</span>
              </h3>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-base-200 text-primary transition-colors"
                aria-label="Close search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Input Box: Not Rounded at all with Inner Padding */}
            <div className="mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fusion pies, grazing packs, recipes..."
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
                    className="rounded-none border border-secondary/30 bg-base-200 px-3 py-1.5 text-xs font-semibold text-primary hover:border-secondary hover:bg-secondary hover:text-secondary-content transition-all"
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
            <span>Handcrafted Fusion Pies Sydney</span>
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
