import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { Shield, Lock, Eye, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Flavour & Co.",
  description:
    "Learn how Flavour & Co. collects, uses, and safeguards your personal information when ordering our artisan pies.",
};

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="How Flavour & Co. collects, uses, and protects your personal information."
    >
      <div className="max-w-4xl mx-auto space-y-8 text-stone-800 text-sm sm:text-base leading-relaxed py-4 text-left">
        
        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Encrypted Payments</h3>
            <p className="text-xs text-stone-600">All checkout transactions are 256-bit SSL encrypted.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">No Data Selling</h3>
            <p className="text-xs text-stone-600">We never trade or sell your personal details to third parties.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-secondary/20 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-primary text-sm">Full Privacy Rights</h3>
            <p className="text-xs text-stone-600">You can request access to or deletion of your data at any time.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">1. Introduction</h2>
          <p>
            Flavour &amp; Co. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy in compliance with the Privacy Act 1988 (Cth) and Australian Privacy Principles (APPs). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or order our gourmet pies.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when placing an order, subscribing to our newsletter, or contacting customer support. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
            <li>Contact details (Name, email address, phone number)</li>
            <li>Shipping and delivery address details</li>
            <li>Payment details (processed securely via accredited PCI-compliant payment gateways; we do not store raw credit card numbers)</li>
            <li>Purchase history and feedback preferences</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">3. How We Use Your Information</h2>
          <p>
            Your information is used strictly to fulfill and deliver your pie orders, communicate order updates, improve our recipe offerings and user experience, and send optional promotional releases if you have subscribed.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">4. Data Protection &amp; Security</h2>
          <p>
            We implement industry-standard administrative, physical, and technical security measures to maintain the safety of your personal data. Access to your personal data is restricted to authorized personnel who need to process orders.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-secondary/15 shadow-sm space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data deletion, email our Privacy Team at{" "}
            <a href="mailto:info@flavourandco.com.au" className="font-bold text-secondary underline">
              info@flavourandco.com.au
            </a>.
          </p>
        </section>

      </div>
    </PageLayout>
  );
}
