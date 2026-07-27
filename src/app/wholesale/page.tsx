import PageLayout from "@/components/PageLayout";
import WholesaleClient from "@/components/WholesaleClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale & Foodservice | Flavour & Co. Sydney",
  description:
    "Partner with Flavour & Co. We supply premium Indo-Australian fusion pies to cafés, caterers, hotels, and foodservice venues across Australia.",
};

export default function WholesalePage() {
  return (
    <PageLayout
      title="Wholesale & Foodservice"
      subtitle="Partner with Flavour & Co to deliver premium Indo-fusion pies across cafés, hotels, caterers and venues."
      fullWidth
    >
      <WholesaleClient />
    </PageLayout>
  );
}
