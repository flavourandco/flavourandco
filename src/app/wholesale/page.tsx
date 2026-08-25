import PageLayout from "@/components/layout/PageLayout";
import WholesaleClient from "@/components/forms/WholesaleClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale & Foodservice | Flavour & Co. Australia",
  description:
    "Partner with Flavour & Co. We supply premium Indo-Australian pies to cafés, caterers, hotels, and foodservice key venues across Australia.",
};

export default function WholesalePage() {
  return (
    <PageLayout
      title="Wholesale & Foodservice"
      subtitle="Partner with Flavour & Co for premium Indo-Australian foodservice solutions, spanning signature pies, South Asian breakfast and canapés for cafés, hotels, caterers and venues nationwide."
      fullWidth
    >
      <WholesaleClient />
    </PageLayout>
  );
}
