import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { navLinks } from "@/lib/data";
import { media } from "@/lib/media";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Food Safety Policy", href: "/food-safety" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-green text-white border-t border-secondary/20 relative overflow-hidden">
      {/* Subtle brand glow in background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Newsletter Signup Banner */}
      <div className="border-b border-secondary/15 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl md:text-4xl text-brand-gold font-medium">
                Join the Family
              </h3>
              <p className="mt-3 max-w-md opacity-80">
                Subscribe for exclusive offers, seasonal pie releases, and updates from Flavour &amp; Co.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="flex-1 border border-secondary/30 bg-white/10 px-5 py-4 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-secondary focus:bg-white/20"
              />
              <button
                type="submit"
                className="bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-[0.15em] text-secondary-content hover:bg-base-100 hover:text-brand-green transition-all duration-300 shadow-md cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 relative z-10">
        
        {/* ───────────────────────────────────────────────────────────
            PC DESKTOP VIEW: Everything Side-by-Side in 5 Columns
           ─────────────────────────────────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-5 gap-8">
          {/* Column 1 & 2: Brand Logo & Overview */}
          <div className="md:col-span-2 md:pr-8">
            <img
              src={media.footerLogo}
              alt="Flavour & Co. Logo"
              className="h-32 lg:h-36 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed opacity-80">
              Flavour &amp; Co. is founded by Simran. We bake our roots into every pie, delivering delicious Indo-Australian pies.
            </p>
            
            {/* Desktop Social Links */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Follow Us</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/plateteamindia?utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-secondary hover:text-brand-green text-white transition-all hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1DQUjBQw5r/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-secondary hover:text-brand-green text-white transition-all hover:scale-105"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-80 transition-colors hover:opacity-100 hover:underline decoration-secondary decoration-2 underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Policy Pages & Contact Info */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Legal &amp; Policy
            </h4>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-80 transition-colors hover:opacity-100 hover:underline decoration-secondary decoration-2 underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Get in Touch
            </h4>
            <ul className="mt-3 space-y-2.5 text-xs opacity-80">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-secondary shrink-0" />
                <a href="mailto:help@flavourandco.com.au" className="hover:underline hover:opacity-100 transition-opacity">
                  help@flavourandco.com.au
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-secondary shrink-0" />
                <a href="tel:+61423092989" className="hover:underline hover:opacity-100 transition-opacity">
                  +61 423 092 989
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Food Safety Badge */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Food Safety
            </h4>
            <div className="mt-5 bg-white p-3.5 rounded-xl inline-block shadow-lg w-full max-w-[240px]">
              <img
                src="/haccp-aust-cert-black.jpg"
                alt="HACCP Certified Food Safety Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────
            MOBILE VIEW: 4 Distinct Sequential Sections
           ─────────────────────────────────────────────────────────── */}
        <div className="flex md:hidden flex-col space-y-8">
          
          {/* Section 1: Brand Logo & Overview */}
          <div className="space-y-4 text-left">
            <img
              src={media.footerLogo}
              alt="Flavour & Co. Logo"
              className="h-24 w-auto object-contain mb-3"
            />
            <p className="text-xs leading-relaxed opacity-80 max-w-sm">
              Flavour &amp; Co. is founded by Simran. We bake our roots into every pie, delivering delicious Indo-Australian pies.
            </p>
          </div>

          {/* Section 2: Quick Links & Legal Pages Side-by-Side */}
          <div className="grid grid-cols-2 gap-6 pt-2 border-t border-secondary/20 text-left">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                Quick Links
              </h4>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs opacity-80 hover:opacity-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                Legal &amp; Policy
              </h4>
              <ul className="mt-4 space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs opacity-80 hover:opacity-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                Get in Touch
              </h4>
              <ul className="mt-3 space-y-2.5 text-xs opacity-80">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <a href="mailto:help@flavourandco.com.au" className="hover:underline hover:opacity-100 transition-opacity">
                    help@flavourandco.com.au
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <a href="tel:+61423092989" className="hover:underline hover:opacity-100 transition-opacity">
                    +61 423 092 989
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Food Safety Logo */}
          <div className="pt-2 border-t border-secondary/20 text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3">
              Food Safety &amp; Quality
            </h4>
            <div className="bg-white p-3 rounded-lg inline-block shadow-md max-w-[200px]">
              <img
                src="/haccp-aust-cert-black.jpg"
                alt="HACCP Certified Food Safety Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Section 4: Socials & Contact */}
          <div className="pt-6 border-t border-secondary/20 flex flex-col items-start gap-5">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Follow Us</span>
              <div className="flex items-center gap-3.5 text-secondary">
                <a
                  href="https://www.instagram.com/plateteamindia?utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1DQUjBQw5r/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <p className="text-[11px] opacity-60">
              &copy; {new Date().getFullYear()} Flavour &amp; Co. All rights reserved. Handcrafted Australia-wide.
            </p>
          </div>

        </div>

        {/* Desktop Copyright Bar */}
        <div className="hidden md:flex mt-12 items-center justify-between border-t border-secondary/20 pt-6 text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} Flavour &amp; Co. All rights reserved.</p>
          <p>Handcrafted by Simran • Australia-Wide Delivery</p>
        </div>

      </div>
    </footer>
  );
}
