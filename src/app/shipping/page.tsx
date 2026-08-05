import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { Truck, RefreshCw, ShieldCheck, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Flavour & Co.",
  description:
    "Learn about Flavour & Co's express delivery schedule, cold-chain packaging, and return policy for artisan pies.",
};

export default function ShippingPage() {
  return (
    <PageLayout
      title="Shipping & Returns"
      subtitle="Australia-wide express delivery schedule, cold-chain packaging, and quality guarantees."
    >
      <div className="max-w-4xl mx-auto space-y-10 text-stone-800 text-sm sm:text-base leading-relaxed py-4 text-left">
        
        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Australia-Wide Express</h3>
              <p className="text-xs text-stone-600 mt-1">Refrigerated express shipping across Australia with cold-chain logistics partners.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Flexible Delivery Slots</h3>
              <p className="text-xs text-stone-600 mt-1">Orders dispatched Tuesday through Saturday in insulated thermal packaging.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Cold-Chain Guarantee</h3>
              <p className="text-xs text-stone-600 mt-1">Pies are packed with cold-chain protection to stay frozen or chilled until unpacking.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Freshness Guarantee</h3>
              <p className="text-xs text-stone-600 mt-1">Full replacement or refund if your order arrives damaged or degraded.</p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">1. Delivery Zones & Rates</h2>
          <p>
            Flavour &amp; Co. delivers fresh and frozen handcrafted pies Australia-wide. Standard express delivery is $15 AUD, and orders over $200 receive <strong>Free Express Shipping</strong>.
          </p>
          <p>
            For wholesale or high-volume orders, shipping is arranged via 3rd party courier (not directly at checkout); our team will reach out directly to coordinate delivery.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">2. Returns & Refunds Policy</h2>
          <p>
            Due to strict food safety standards, we cannot accept physical returns of perishable food items once delivered. However, if your items arrive damaged, defrosted inappropriately, or incorrect:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li>Take clear photographs of the package and item condition upon arrival.</li>
            <li>Contact our team within <strong>24 hours</strong> of delivery.</li>
            <li>We will promptly process a full refund or re-dispatch a fresh shipment at no additional cost.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">3. Order Cancellations & Modifying Orders</h2>
          <p>
            Modifications or cancellations must be submitted at least 24 hours prior to your scheduled dispatch date. Once pies are baked and packed in cold-chain logistics, cancellations cannot be honored.
          </p>
        </section>

        {/* Contact Banner */}
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-6 text-center space-y-3">
          <h3 className="font-serif text-lg font-bold text-brand-green">Need Assistance with an Order?</h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Our support team is available Monday through Saturday. Contact us at{" "}
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
