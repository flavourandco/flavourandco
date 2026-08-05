import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { FileText, ShieldAlert, Award, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Flavour & Co.",
  description:
    "Terms and conditions governing the use of Flavour & Co. website, product purchases, and Australia-wide delivery services.",
};

export default function TermsPage() {
  return (
    <PageLayout
      title="Terms of Service"
      subtitle="Terms and conditions governing the use of Flavour & Co. products and services."
    >
      <div className="max-w-4xl mx-auto space-y-8 text-stone-800 text-sm sm:text-base leading-relaxed py-4 text-left">

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Fair Trading</h3>
            <p className="text-xs text-stone-600">Governed under Australian Consumer Law and NSW fair trading standards.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Quality Commitment</h3>
            <p className="text-xs text-stone-600">Authentic Indo-Australian recipes baked fresh in Sydney.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Perishable Goods</h3>
            <p className="text-xs text-stone-600">Cold-chain delivery policy requiring prompt refrigeration upon receipt.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">1. Agreement to Terms</h2>
          <p>
            By placing an order or using the Flavour &amp; Co. website, you agree to be bound by these Terms of Service. All content, recipes, brand assets, imagery, and intellectual property remain the property of Flavour &amp; Co.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">2. Orders, Pricing &amp; Availability</h2>
          <p>
            All prices are listed in Australian Dollars ($AUD) and include GST unless stated otherwise. Products are subject to availability. Flavour &amp; Co. reserves the right to decline or adjust orders in the event of stock limitations or pricing errors.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">3. Delivery &amp; Perishable Product Policy</h2>
          <p>
            Orders are delivered Australia-wide via refrigerated couriers. Due to the perishable nature of handcrafted pies, recipients are responsible for ensuring someone is available to receive or refrigerate items upon arrival.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">4. HACCP Compliance &amp; Refunds</h2>
          <p>
            We prepare all pies under strict HACCP accredited hygiene protocols. If your shipment arrives damaged or sub-standard, notify us within 24 hours with photos for a prompt replacement or refund.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">5. Contact Information</h2>
          <p>
            For questions or support regarding these terms, email <a href="mailto:info@flavourandco.com.au" className="font-bold text-secondary underline">info@flavourandco.com.au</a> or call +61 423 092 989.
          </p>
        </section>

      </div>
    </PageLayout>
  );
}
