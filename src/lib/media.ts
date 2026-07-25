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
  }
} as const;

export default media;
