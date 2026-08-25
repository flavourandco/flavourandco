import PageLayout from "@/components/layout/PageLayout";
import FaqClient from "@/components/forms/FaqClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Flavour & Co. | Artisan Pies Australia",
  description:
    "Find answers to common questions about Flavour & Co's artisan Indo-Australian pies, heating instructions, catering, grazing boxes, and wholesale delivery.",
};

export default function FAQPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about ordering, heating, delivery, catering, and our range of premium Indo-Australian pies, breakfast offerings and canapés."
      fullWidth={true}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-12 md:pb-16">
        <FaqClient />
      </div>
    </PageLayout>
  );
}
