export const marqueeItems = [
  "plate of origin on channel 7",
  "indo-australian fusion pies",
  "delivering sydney-wide",
  "handcrafted by simran",
  "authentic heritage spices",
  "made with love",
] as const;

export const tickerItems = [
  "plate of origin",
  "indo-australian fusion",
  "sydney-wide delivery",
  "heritage recipes",
  "flaky butter pastry",
  "made with love",
] as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "FAQs", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const homeNavLinks = [
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "Our Story", href: "/our-story", hasDropdown: true },
] as const;

export interface ProductVariant {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // base price (matches variants[0].price)
  image: string; // base image (matches images[0])
  images: [string, string]; // [normal, hover]
  badge?: string;
  category: "freshly-baked" | "frozen" | "grazing-box";
  variants: ProductVariant[];

  // Backward compatibility support for navigation/carousel routing
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  option1Name?: string;
  option1Choices?: ProductVariant[];
  option2Name?: string;
  option2Choices?: string[];
}

export const products: Product[] = [
  {
    id: "mini-authentic-butter-chicken",
    name: "Mini Authentic Butter Chicken Pie",
    description: "Miniature party-sized butter chicken pies. Golden pastry outside, creamy rich butter chicken inside. Pack of 12 pies.",
    price: 34.99,
    image: "/products/PHOTOS_Flavour&Co-5.jpg",
    images: ["/products/PHOTOS_Flavour&Co-5.jpg", "/products/PHOTOS_Flavour&Co-3.jpg"],
    badge: "Best Seller",
    category: "frozen",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    option1Name: "Preparation",
    variants: [
      { name: "Freshly Baked", price: 34.99 },
      { name: "Frozen (Bake at Home)", price: 34.99 }
    ]
  },
  {
    id: "mini-samosa",
    name: "Mini Samosa Pie",
    description: "Bite-sized mini samosa pies, featuring spiced potato and pea filling in flaky pastry sheets. Pack of 12 pies.",
    price: 27.99,
    image: "/products/PHOTOS_Flavour&Co-6.jpg",
    images: ["/products/PHOTOS_Flavour&Co-6.jpg", "/products/PHOTOS_Flavour&Co-9.jpg"],
    category: "frozen",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    option1Name: "Preparation",
    variants: [
      { name: "Freshly Baked", price: 27.99 },
      { name: "Frozen (Bake at Home)", price: 27.99 }
    ]
  },
  {
    id: "mini-lamb-keema",
    name: "Mini Lamb Keema Pie",
    description: "Bite-sized miniature keema lamb pies infused with heritage spices. Pack of 12 pies.",
    price: 39.99,
    image: "/products/PHOTOS_Flavour&Co-7.jpg",
    images: ["/products/PHOTOS_Flavour&Co-7.jpg", "/products/PHOTOS_Flavour&Co-4.jpg"],
    category: "frozen",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    option1Name: "Preparation",
    variants: [
      { name: "Freshly Baked", price: 39.99 },
      { name: "Frozen (Bake at Home)", price: 39.99 }
    ]
  },
  {
    id: "mini-achari-paneer-pie",
    name: "Mini Achari Paneer Pie",
    description: "Miniature party-sized paneer pies filled with cottage cheese cooked in aromatic pickled achari spices, wrapped in golden pastry. Pack of 12 pies.",
    price: 34.99,
    image: "/products/mini-achari-paneer.png",
    images: ["/products/mini-achari-paneer.png", "/products/mini-achari-paneer.png"],
    category: "frozen",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    option1Name: "Preparation",
    variants: [
      { name: "Freshly Baked", price: 34.99 },
      { name: "Frozen (Bake at Home)", price: 34.99 }
    ]
  },
  {
    id: "chicken-tikka-samosa",
    name: "Chicken Tikka Samosa",
    description: "Succulent chicken tikka bites in a rich masala filling, wrapped in a crispy triangle samosa pastry. Pack of 12 samosas.",
    price: 39.99,
    image: "/products/chicken-tikka-samosa.png",
    images: ["/products/chicken-tikka-samosa.png", "/products/chicken-tikka-samosa.png"],
    category: "frozen",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    option1Name: "Preparation",
    variants: [
      { name: "Freshly Baked", price: 39.99 },
      { name: "Frozen (Bake at Home)", price: 39.99 }
    ]
  },
  {
    id: "paneer-empanada",
    name: "Paneer Empanada",
    description: "Crimped crescent pastries stuffed with spiced paneer, green peas, onions, and traditional herbs. Pack of 12 empanadas.",
    price: 24.99,
    image: "/products/paneer-empanada.png",
    images: ["/products/paneer-empanada.png", "/products/paneer-empanada.png"],
    category: "frozen",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    option1Name: "Preparation",
    variants: [
      { name: "Freshly Baked", price: 24.99 },
      { name: "Frozen (Bake at Home)", price: 24.99 }
    ]
  },
  {
    id: "authentic-butter-chicken",
    name: "Authentic Butter Chicken - Ind",
    description: "Tender chicken pieces simmered in our signature rich, creamy butter chicken gravy, encased in golden flaky pastry. Pack of 2 individual portions.",
    price: 22.99,
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    images: ["/products/PHOTOS_Flavour&Co-3.jpg", "/products/PHOTOS_Flavour&Co-3.jpg"],
    badge: "220g",
    category: "freshly-baked",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    option1Name: "Serving Size",
    option2Name: "Preparation",
    option2Choices: ["Frozen"],
    variants: [
      { name: "Pack of 2 (Frozen Only)", price: 22.99 }
    ]
  },
  {
    id: "100-vegetarian-samosa",
    name: "Samosa Pie - Ind",
    description: "Crisp, flaky pastry loaded with spiced potatoes, green peas, and Simran's custom aromatic garam masala blend. Pack of 2 individual portions.",
    price: 18.99,
    image: "/products/PHOTOS_Flavour&Co-8.jpg",
    images: ["/products/PHOTOS_Flavour&Co-8.jpg", "/products/PHOTOS_Flavour&Co-6.jpg"],
    category: "freshly-baked",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    option1Name: "Serving Size",
    option2Name: "Preparation",
    option2Choices: ["Frozen"],
    variants: [
      { name: "Pack of 2 (Frozen Only)", price: 18.99 }
    ]
  },
  {
    id: "lamb-keema",
    name: "Lamb Keema Pie - Ind",
    description: "Slow-cooked spiced minced lamb with homemade roasted spices for a deep, authentic Indian heritage flavour. Pack of 2 individual portions.",
    price: 27.99,
    image: "/products/PHOTOS_Flavour&Co-9.jpg",
    images: ["/products/PHOTOS_Flavour&Co-9.jpg", "/products/PHOTOS_Flavour&Co-5.jpg"],
    badge: "220g",
    category: "freshly-baked",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    option1Name: "Serving Size",
    option2Name: "Preparation",
    option2Choices: ["Frozen"],
    variants: [
      { name: "Pack of 2 (Frozen Only)", price: 27.99 }
    ]
  },
  {
    id: "mixed-individual-pack",
    name: "Mixed Individual Pack",
    description: "Get a perfect mix of our premium individual pies: one Butter Chicken, one Samosa, and one Lamb Keema. Pack of 3 portions.",
    price: 33.00,
    image: "/products/mixed-individual-pack.png",
    images: ["/products/mixed-individual-pack.png", "/products/mixed-individual-pack.png"],
    category: "freshly-baked",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    option1Name: "Serving Size",
    option2Name: "Preparation",
    option2Choices: ["Frozen"],
    variants: [
      { name: "Pack of 3 (Frozen Only)", price: 33.00 }
    ]
  },
  {
    id: "grazing-box",
    name: "Grazing Platter",
    description: "The ultimate crowd pleaser platter featuring 30 premium fusion pies. Freshly baked only. Perfect for office catering, family gathers, and parties.",
    price: 70.00,
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    images: ["/products/PHOTOS_Flavour&Co-3.jpg", "/products/PHOTOS_Flavour&Co-4.jpg"],
    category: "grazing-box",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    option1Name: "Platter Selection",
    option2Name: "Preparation",
    option2Choices: ["Freshly Baked"],
    variants: [
      { name: "30 Samosa Platter", price: 70.00 },
      { name: "30 Butter Chicken Platter", price: 90.00 },
      { name: "Mixed Platter (10 of each pie)", price: 90.00 },
      { name: "30 Lamb Keema Platter", price: 100.00 }
    ]
  }
];

export const testimonials = [
  {
    quote:
      "Simran's butter chicken pie is the best fusion food I've ever tasted. The pastry is incredibly flaky and the filling is rich and authentic.",
    author: "Monica G. (Sydney)",
    rating: 5,
  },
  {
    quote:
      "We ordered the Mini Keema Lamb party pack for our Diwali party and they were a massive hit! Highly recommend their grazing boxes too.",
    author: "Vikram S. (Parramatta)",
    rating: 5,
  },
  {
    quote:
      "Representing India on Plate of Origin was no fluke — these pies are pure culinary magic. A perfect blend of Indian spices and classic Aussie pies.",
    author: "David L. (Surry Hills)",
    rating: 5,
  },
  {
    quote:
      "The Samosa Pie is an absolute gamechanger for vegetarians! Flaky, perfectly spiced, and delivered fresh to our door.",
    author: "Ananya R. (Manly)",
    rating: 5,
  },
  {
    quote:
      "We catered our office lunch with Flavour & Co. party pies. Everyone was blown away by the authentic gourmet flavours!",
    author: "Marcus T. (Chatswood)",
    rating: 5,
  },
  {
    quote:
      "Hands down the best pies in Australia. You can taste the love and heritage baked into every single layer of pastry.",
    author: "Priya & Liam K. (Bondi)",
    rating: 5,
  },
] as const;

export const footerLinks = {
  shop: [
    { label: "Butter Chicken Pie", href: "/shop" },
    { label: "Keema Lamb Pie", href: "/shop" },
    { label: "Samosa Pie", href: "/shop" },
    { label: "Shop All Pies", href: "/shop" },
  ],
  explore: [
    { label: "Our Story", href: "/our-story" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "FAQs", href: "/faq" },
    { label: "Blog", href: "/blog" },
  ],
  company: [
    { label: "Contact Us", href: "/contact" },
    { label: "My Account", href: "/login" },
  ],
} as const;

export const craftFeatures = [
  {
    title: "Plate of Origin",
    description: "As seen on Channel 7's hit cooking show, proudly representing Flavour & Co.'s unique flavours.",
  },
  {
    title: "Indo-Aussie Fusion",
    description: "The ultimate culinary marriage of rich Indian spice fillings and flaky, buttery Australian pastry.",
  },
  {
    title: "Sydney-Wide Delivery",
    description: "Delivering fresh and frozen gourmet pies right to your doorstep, baked fresh by Simran.",
  },
] as const;

