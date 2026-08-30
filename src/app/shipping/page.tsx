"use client";

import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { Truck, RefreshCw, ShieldCheck, Clock } from "lucide-react";
import { useFreeDeliveryThreshold } from "@/hooks/useFreeDeliveryThreshold";

export default function ShippingPage() {
  const freeDeliveryThreshold = useFreeDeliveryThreshold();

  return (
    <PageLayout
      title="Shipping & Delivery"
      subtitle="Direct temperature-controlled delivery across Australia, packaging details, and quality guarantees."
    >
      <div className="max-w-4xl mx-auto space-y-10 text-stone-800 text-sm sm:text-base leading-relaxed py-4 text-left">
        
        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Direct Delivery</h3>
              <p className="text-xs text-stone-600 mt-1">Delivering handcrafted Indo-Australian food products directly to your door with temperature-controlled packaging.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Fresh or Frozen Choice</h3>
              <p className="text-xs text-stone-600 mt-1">Select your preferred format (freshly baked or frozen pack) directly when adding items on the shop page.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Cold-Chain Packaging</h3>
              <p className="text-xs text-stone-600 mt-1">For frozen orders, your products are transported in temperature-controlled packaging to help maintain optimal temperature throughout delivery.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary shrink-0">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">Freshness Guarantee</h3>
              <p className="text-xs text-stone-600 mt-1">Full replacement or refund if your handcrafted products arrive damaged or degraded.</p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">1. Delivery Coverage &amp; Rates</h2>
          <p>
            Flavour &amp; Co. delivers fresh and frozen handcrafted gourmet pies across <strong>Greater Sydney (within ~50km radius)</strong>. Your order is prepared fresh or snap-frozen and packed with cold-chain insulation for direct doorstep delivery.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700 text-sm">
            <li>
              <strong>Tier 1 (Selected Local Postcodes):</strong> 100% Free Delivery on all orders, with no minimum spend required.
            </li>
            <li>
              <strong>Tier 2 (Greater Sydney up to 50km):</strong> Standard Express Delivery is $15 AUD, or <strong>FREE</strong> for all orders of ${freeDeliveryThreshold} or more.
            </li>
            <li>
              <strong>Tier 3 (Regional &amp; Interstate):</strong> Direct delivery is currently paused to guarantee peak cold-chain freshness.
            </li>
          </ul>
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
            Modifications or cancellations must be submitted at least 24 hours prior to your scheduled dispatch date. Once products are prepared and scheduled for courier dispatch, cancellations cannot be honored.
          </p>
        </section>

        {/* Contact Banner */}
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-6 text-center space-y-3">
          <h3 className="font-serif text-lg font-bold text-brand-green">Need Assistance with an Order?</h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Our support team is available Monday through Saturday. Contact us at{" "}
            <a href="mailto:help@flavourandco.com.au" className="font-bold text-secondary underline">
              help@flavourandco.com.au
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
