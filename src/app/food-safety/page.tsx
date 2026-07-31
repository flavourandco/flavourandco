import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import { ShieldCheck, Award, Flame, Snowflake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Safety & HACCP Standards | Flavour & Co.",
  description:
    "Flavour & Co. operates under strict HACCP food safety certification. Read our food safety policies, allergen guidelines, and pie heating recommendations.",
};

export default function FoodSafetyPage() {
  return (
    <PageLayout
      title="Food Safety Policy"
      subtitle="Certified HACCP standards, allergen management, and proper pie heating guidelines."
    >
      <div className="max-w-4xl mx-auto space-y-10 text-stone-800 text-sm sm:text-base leading-relaxed py-4 text-left">
        
        {/* Certification Badge Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/20 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200 shrink-0 w-36 sm:w-44 text-center">
            <img
              src="/haccp-aust-cert-black.jpg"
              alt="HACCP Certified Food Safety Logo"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-block px-3 py-1 bg-secondary/15 text-secondary text-[11px] font-bold uppercase tracking-wider rounded-md">
              Certified Quality
            </span>
            <h2 className="font-serif text-2xl font-bold text-primary">HACCP Accredited Bakery</h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Flavour &amp; Co. adheres to international HACCP (Hazard Analysis Critical Control Point) systems to guarantee maximum food hygiene, microbial safety, and quality control at every stage.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Ingredient Traceability</h3>
            <p className="text-xs text-stone-600">Strict audits of locally sourced Australian meats, dairy, and authentic imported spices.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Snowflake className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Blast Freezing</h3>
            <p className="text-xs text-stone-600">Freshly baked pies are rapidly frozen at peak freshness to lock in moisture and flavor.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Safe Reheating</h3>
            <p className="text-xs text-stone-600">Detailed oven and air-fryer heating guides on every pack for perfect flaky crusts.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">1. Hygiene & Manufacturing Standards</h2>
          <p>
            Our commercial bakery in Sydney undergoes regular food safety inspections and internal audits. All pastry chefs and kitchen team members are trained in food safety handling, allergen cross-contamination prevention, and sanitation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">2. Allergen Advisory</h2>
          <p>
            Our products are prepared in a kitchen that handles wheat (gluten), dairy, eggs, nuts, and sesame. Detailed ingredients and allergen callouts are printed on every pie box and listed on our shop product pages.
          </p>
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs sm:text-sm rounded-r-md">
            <strong>Note for Severe Allergies:</strong> While we follow strict sanitization protocols between batches, our equipment is shared. Individuals with severe anaphylactic allergies should consult with us before ordering.
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">3. Storage & Heating Instructions</h2>
          <p>
            For best results, store your pies in the freezer at or below -18°C. When ready to enjoy:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li><strong>Oven (Recommended):</strong> Preheat oven to 180°C (350°F). Bake frozen pie for 25–30 minutes until golden and internal temperature reaches 75°C+.</li>
            <li><strong>Air Fryer:</strong> Bake at 170°C for 20 minutes for an ultra-flaky crust.</li>
          </ul>
        </section>

        {/* Contact Banner */}
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-6 text-center space-y-3">
          <h3 className="font-serif text-lg font-bold text-brand-green">Have Allergen or Storage Questions?</h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Reach out to Simran and the team at{" "}
            <a href="mailto:info@flavourandco.com.au" className="font-bold text-secondary underline">
              info@flavourandco.com.au
            </a>{" "}
            or visit our{" "}
            <Link href="/faq" className="font-bold text-secondary underline">
              FAQ page
            </Link>.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
