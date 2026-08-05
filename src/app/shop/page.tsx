import PageLayout from "@/components/layout/PageLayout";
import Products from "@/components/products/Products";

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
