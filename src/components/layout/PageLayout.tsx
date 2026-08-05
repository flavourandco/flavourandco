import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

type PageLayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  hideHeader?: boolean;
};

export default function PageLayout({
  title,
  subtitle,
  eyebrow,
  children,
  fullWidth = false,
  hideHeader = false,
}: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-[88px] sm:pt-[96px] md:pt-[104px]">
        {!hideHeader && (
          <PageHeader title={title} subtitle={subtitle} eyebrow={eyebrow} />
        )}

        {children ? (
          fullWidth ? (
            children
          ) : (
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
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
