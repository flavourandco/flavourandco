import PageLayout from "@/components/PageLayout";
import BlogClient from "@/components/BlogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Journal | Flavour & Co. Australia",
  description:
    "Explore recipes, baking stories, heating tips, and founder insights from Simran and the Flavour & Co team.",
};

export default function BlogPage() {
  return (
    <PageLayout
      title="Blog & Journal"
      subtitle="Recipes, heritage stories, heating guides, and founder insights from Simran and our Australian bakery."
      fullWidth
    >
      <BlogClient />
    </PageLayout>
  );
}
