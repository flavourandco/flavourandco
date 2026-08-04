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
    y2021: "/timeline/timeline-2021.webp",
    y2022: "/timeline/timeline-2022.webp",
    y2024: "/timeline/timeline-2024.webp",
    y2025: "/timeline/timeline-2025.webp",
    y2026: "/timeline/timeline-2026.webp",
    // Backwards compatibility aliases
    spark: "/timeline/timeline-2018.webp",
    plateOfOrigin: "/timeline/timeline-2020.webp",
    myTeamIndia: "/timeline/timeline-2021.webp",
    commercialKitchen: "/timeline/timeline-2022.webp",
    ownFacility: "/timeline/timeline-2024.webp",
    builtForBusiness: "/timeline/timeline-2025.webp",
    flavourAndCo: "/timeline/timeline-2026.webp",
  },
} as const;

export default media;
