// Media asset registry for Flavour & Co.

export const media = {
  logo: "/navbar_brand_logo.png",
  navbarLogo: "/navbar_brand_logo.png",
  footerLogo: "/footer_brand_logo.png",
  heroVideo: "/pies.mp4",

  // Local high-quality pie and bakery images from /products/
  products: {
    butterChicken: "/products/PHOTOS_Flavour&Co-3.jpg",
    samosaPie: "/products/PHOTOS_Flavour&Co-4.jpg",
    lambKeema: "/products/PHOTOS_Flavour&Co-5.jpg",
    paneerTikka: "/products/PHOTOS_Flavour&Co-6.jpg",
  },

  moods: {
    gather: "/products/PHOTOS_Flavour&Co-7.jpg",
    celebrate: "/products/PHOTOS_Flavour&Co-8.jpg",
    unwind: "/products/PHOTOS_Flavour&Co-9.jpg",
    entertain: "/products/PHOTOS_Flavour&Co-3.jpg",
  },

  about: {
    kitchen: "/founder/simran-kitchen.jpg",
    baker: "/founder/simran-kitchen.jpg",
  },

  timeline: {
    y2018: "/timeline/timeline-2018.webp",
    y2020: "/timeline/timeline-2020.webp",
    y2021Markets: "/timeline/market-stalls.jpeg",
    y2021GoingLive: "/timeline/timeline-2021.webp",
    y2022: "/timeline/timeline-2022.webp",
    y2024: "/timeline/timeline-2024.webp",
    y2025: "/timeline/bringing-people-together.jpeg",
    y2026: "/footer_brand_logo.png",
    // Backwards compatibility aliases
    spark: "/timeline/timeline-2018.webp",
    plateOfOrigin: "/timeline/timeline-2020.webp",
    marketStalls: "/timeline/market-stalls.jpeg",
    myTeamIndia: "/timeline/timeline-2021.webp",
    commercialKitchen: "/timeline/timeline-2022.webp",
    ownFacility: "/timeline/timeline-2024.webp",
    bringingPeopleTogether: "/timeline/bringing-people-together.jpeg",
    flavourAndCo: "/footer_brand_logo.png",
  },

  blogs: {
    blog1_main: "/blog/blog-1.webp",
    blog2_main: "/blog/blog-2.1.png",
    blog2_sub: "/blog/blog-2.2.avif",
    blog3_main: "/blog/blog-3.1.avif",
    blog3_sub: "/blog/blog-3.2.avif",
    blog4_main: "/blog/blog 4.1.jpg",
    blog4_sub: "/blog/blog-4.2.avif",
  },
} as const;

export default media;
