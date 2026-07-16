import AnnouncementBar from "@/components/home/AnnouncementBar";
import HomeNavbar from "@/components/home/HomeNavbar";
import SmoothScroll from "@/components/home/SmoothScroll";
import HomeHero from "@/components/home/HomeHero";
import FeatureTicker from "@/components/home/FeatureTicker";
import HomeAbout from "@/components/home/HomeAbout";
import HomeProducts from "@/components/home/HomeProducts";
import HomeMoods from "@/components/home/HomeMoods";
import HomeTestimonials, { HomeBundleCTA } from "@/components/home/HomeTestimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HomeNavbar />
      <SmoothScroll>
        <main>
          <HomeHero />
          <FeatureTicker />
          <HomeProducts />
          <HomeAbout />
          <AnnouncementBar />
          <HomeMoods />
          <HomeTestimonials />
          <HomeBundleCTA />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}

