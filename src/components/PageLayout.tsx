import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PageLayoutProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  hideHeader?: boolean;
};

export default function PageLayout({
  title,
  subtitle,
  children,
  fullWidth = false,
  hideHeader = false,
}: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-20">
        {!hideHeader && (
          <div className="border-b border-brand-gold/20 bg-brand-green h-48 md:h-64 lg:h-72 relative overflow-hidden flex items-center justify-center w-full">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-brand-gold blur-3xl" />
            </div>
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8 relative z-10 w-full">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold mb-1">
                Flavour & Co.
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-white font-medium">
                {title}
              </h1>
              {subtitle && (
                <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-cream/70 tracking-wide">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {children ? (
          fullWidth ? (
            children
          ) : (
            <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
              {children}
            </div>
          )
        ) : (
          <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
            <p className="text-lg leading-relaxed text-charcoal/60">
              This page is coming soon. We&apos;re crafting something special for you.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block text-[12px] font-bold uppercase tracking-[0.15em] text-brand-green border-2 border-brand-green/20 hover:bg-brand-green hover:text-white px-6 py-3 rounded-md transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
