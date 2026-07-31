import PageLayout from "@/components/PageLayout";
import Products from "@/components/Products";

export default function ShopPage() {
  return (
    <PageLayout
      title="Shop"
      subtitle="Explore our full range of handcrafted Indo-Australian pies."
      fullWidth
      hideHeader={true}
    >
      <Products />
    </PageLayout>
  );
}
