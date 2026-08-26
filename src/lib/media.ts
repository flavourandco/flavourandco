export const PRODUCT_PLACEHOLDER = "/product-placeholder.svg";

export function isRealImage(src?: string | null): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed === PRODUCT_PLACEHOLDER ||
    trimmed === "/grey-product-placeholder.svg" ||
    trimmed.startsWith("/products/")
  ) {
    return false;
  }
  return true;
}

export function getProductImage(src?: string | null): string {
  if (!isRealImage(src)) {
    return PRODUCT_PLACEHOLDER;
  }
  return src!;
}

export function getValidProductImages(product?: { image?: string | null; images?: (string | null)[] | null } | null): string[] {
  if (!product) return [PRODUCT_PLACEHOLDER];

  const rawList: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img && typeof img === "string") rawList.push(img);
    });
  }
  if (product.image && typeof product.image === "string" && !rawList.includes(product.image)) {
    rawList.push(product.image);
  }

  const realImages = rawList.filter((img) => isRealImage(img));

  if (realImages.length > 0) {
    return realImages;
  }

  return [PRODUCT_PLACEHOLDER];
}

export const media = {
  logo: "/navbar_brand_logo.png",
  navbarLogo: "/navbar_brand_logo.png",
  footerLogo: "/footer_brand_logo.png",
  heroVideo: "/pies.mp4",

  // Product images default to grey product placeholder until Cloudinary images are uploaded
  products: {
    butterChicken: PRODUCT_PLACEHOLDER,
    samosaPie: PRODUCT_PLACEHOLDER,
    lambKeema: PRODUCT_PLACEHOLDER,
    paneerTikka: PRODUCT_PLACEHOLDER,
  },

  moods: {
    gather: PRODUCT_PLACEHOLDER,
    celebrate: PRODUCT_PLACEHOLDER,
    unwind: PRODUCT_PLACEHOLDER,
    entertain: PRODUCT_PLACEHOLDER,
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
