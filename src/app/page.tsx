import HomeNavbar from "@/components/home/HomeNavbar";
import HomeHero from "@/components/home/HomeHero";
import HomeProducts from "@/components/home/HomeProducts";
import HomeAbout from "@/components/home/HomeAbout";
import HomeTestimonials, { HomeBundleCTA } from "@/components/home/HomeTestimonials";
import OfferModal from "@/components/home/OfferModal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <OfferModal />
      <HomeNavbar />
      <main className="pt-4 md:pt-0">
        <HomeHero />
        <HomeProducts />
        <HomeAbout />
        <HomeTestimonials />
        <HomeBundleCTA />
      </main>
      <Footer />
    </>
  );
}
