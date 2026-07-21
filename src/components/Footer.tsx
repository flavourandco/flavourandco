import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { navLinks } from "@/lib/data";
import { media } from "@/lib/media";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-content border-t border-secondary/20 relative overflow-hidden">
      {/* Subtle brand glow in the footer */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="border-b border-secondary/15 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl md:text-4xl text-primary-content font-medium">
                Join the Family
              </h3>
              <p className="mt-3 max-w-md opacity-80">
                Subscribe for exclusive offers, seasonal fusion pie releases, and updates from Ash & Simran.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="flex-1 border border-secondary/30 bg-primary-content/10 px-5 py-4 text-sm text-primary-content placeholder:text-primary-content/50 outline-none transition-colors focus:border-secondary focus:bg-primary-content/20"
              />
              <button
                type="submit"
                className="bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-[0.15em] text-secondary-content hover:bg-base-100 hover:text-primary transition-all duration-300 shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 relative z-10">
        <div className="grid gap-10 md:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={media.logo}
                alt="Flavour & Co. Logo"
                className="h-16 lg:h-20 w-auto object-contain"
              />
            </div>
            <p className="mt-5 text-sm leading-relaxed opacity-80">
              Flavour & Co. is us, Ash & Simran. We bake our roots into every pie, delivering delicious Indo-Australian fusion pies Sydney-wide.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="opacity-60 transition-colors hover:opacity-100 hover:text-secondary"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="opacity-60 transition-colors hover:opacity-100 hover:text-secondary"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@flavourandco.com.au"
                aria-label="Email"
                className="opacity-60 transition-colors hover:opacity-100 hover:text-secondary"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Group Quick Links and Contact side-by-side on mobile/tablet, and expand to separate columns on desktop */}
          <div className="grid grid-cols-2 gap-6 md:col-span-1 lg:contents">
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

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                Contact
              </h4>
              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3 text-sm opacity-80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  Sydney, NSW, Australia
                </li>
                <li className="flex items-center gap-3 text-sm opacity-80">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  +61 423 092 989
                </li>
                <li className="flex items-center gap-3 text-sm opacity-80">
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
                  info@flavourandco.com.au
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Hours
            </h4>
            <ul className="mt-5 space-y-2 text-sm opacity-80">
              <li className="flex justify-between border-b border-secondary/10 pb-1">
                <span>Mon – Fri</span>
                <span className="font-semibold opacity-100">8am – 6pm</span>
              </li>
              <li className="flex justify-between border-b border-secondary/10 pb-1">
                <span>Saturday</span>
                <span className="font-semibold opacity-100">9am – 5pm</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold opacity-100">10am – 4pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-secondary/20 pt-6 md:flex-row">
          <p className="text-xs opacity-50">
            &copy; {new Date().getFullYear()} Flavour & Co. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs opacity-50">
            <Link href="/privacy" className="transition-colors hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:opacity-100">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
