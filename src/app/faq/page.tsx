import PageLayout from "@/components/PageLayout";
import FaqClient from "@/components/FaqClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Flavour & Co. | Artisan Fusion Pies Sydney",
  description:
    "Find answers to common questions about Flavour & Co's artisan Indo-Australian fusion pies, heating instructions, catering, grazing boxes, and wholesale delivery.",
};

export default function FAQPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about ordering, heating, delivery, catering, and our artisan fusion pies."
      fullWidth={true}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-12 md:pb-16">
        <FaqClient />
      </div>
    </PageLayout>
  );
}
