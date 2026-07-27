import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { navLinks } from "@/lib/data";
import { media } from "@/lib/media";

export default function Footer() {
  return (
    <footer className="bg-brand-green text-white border-t border-secondary/20 relative overflow-hidden">
      {/* Subtle brand glow in the footer */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="border-b border-secondary/15 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl md:text-4xl text-brand-gold font-medium">
                Join the Family
              </h3>
              <p className="mt-3 max-w-md opacity-80">
                Subscribe for exclusive offers, seasonal fusion pie releases, and updates from Simran.
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
                className="bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-[0.15em] text-secondary-content hover:bg-base-100 hover:text-brand-green transition-all duration-300 shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 relative z-10">
        <div className="grid gap-10 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:pr-10">
            <div className="flex items-center gap-3">
              <img
                src={media.footerLogo}
                alt="Flavour & Co. Logo"
                className="h-32 lg:h-40 w-auto object-contain"
              />
            </div>
            <p className="mt-5 text-sm leading-relaxed opacity-80">
              Flavour & Co. is founded by Simran. We bake our roots into every pie, delivering delicious Indo-Australian fusion pies Sydney-wide.
            </p>
          </div>

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

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Food Safety
            </h4>
            <div className="mt-5 bg-white p-4 rounded-xl inline-block shadow-lg w-full max-w-[260px]">
              <img
                src="/haccp-aust-cert-black.jpg"
                alt="HACCP Certified Food Safety Logo"
                className="w-full h-auto object-contain"
              />
            </div>
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
