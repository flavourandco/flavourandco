import HomeNavbar from "@/components/home/HomeNavbar";
import HomeHero from "@/components/home/HomeHero";
import HomeProducts from "@/components/home/HomeProducts";
import HomeTestimonials, { HomeBundleCTA } from "@/components/home/HomeTestimonials";
import OfferModal from "@/components/home/OfferModal";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <OfferModal />
      <HomeNavbar />
      <main className="pt-4 md:pt-0">
        <HomeHero />
        <HomeProducts />
        <HomeTestimonials />
        <HomeBundleCTA />
      </main>
      <Footer />
    </>
  );
}
