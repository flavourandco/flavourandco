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
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  option1Name?: string;
  option1Choices?: ProductVariant[];
  option2Name?: string;
  option2Choices?: string[];
}

export const products: Product[] = [
  {
    id: "mini-authentic-butter-chicken",
    name: "Mini Authentic Butter Chicken",
    description: "Miniature party-sized butter chicken pies. Golden pastry outside, creamy rich butter chicken inside. Delivered frozen.",
    price: 34.99,
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    images: ["/products/PHOTOS_Flavour&Co-3.jpg", "/products/PHOTOS_Flavour&Co-8.jpg"],
    badge: "Best Seller",
    category: "frozen",
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { name: "Single Pack (12 Pies)", price: 34.99 },
      { name: "Party Pack (24 Pies)", price: 59.99 }
    ]
  },
  {
    id: "mini-samosa",
    name: "Mini Samosa",
    description: "Bite-sized mini samosa pies, featuring spiced potato and pea filling in flaky pastry sheets. A crowd favorite.",
    price: 27.99,
    image: "/products/PHOTOS_Flavour&Co-6.jpg",
    images: ["/products/PHOTOS_Flavour&Co-6.jpg", "/products/PHOTOS_Flavour&Co-9.jpg"],
    category: "frozen",
    isFeatured: false,
    variants: [
      { name: "Single Pack (12 Pies)", price: 27.99 },
      { name: "Party Pack (24 Pies)", price: 49.99 }
    ]
  },
  {
    id: "mini-lamb-keema",
    name: "Mini Lamb Keema",
    description: "Bite-sized miniature keema lamb pies infused with heritage spices. Delivered frozen and perfect for parties.",
    price: 34.99,
    image: "/products/PHOTOS_Flavour&Co-5.jpg",
    images: ["/products/PHOTOS_Flavour&Co-5.jpg", "/products/PHOTOS_Flavour&Co-4.jpg"],
    category: "frozen",
    isFeatured: true,
    variants: [
      { name: "Single Pack (12 Pies)", price: 34.99 },
      { name: "Party Pack (24 Pies)", price: 59.99 }
    ]
  },
  {
    id: "100-vegetarian-samosa",
    name: "100% Vegetarian Samosa",
    description: "Crisp, flaky pastry loaded with spiced potatoes, green peas, and Simran's custom aromatic garam masala blend.",
    price: 18.99,
    image: "/products/PHOTOS_Flavour&Co-6.jpg",
    images: ["/products/PHOTOS_Flavour&Co-6.jpg", "/products/PHOTOS_Flavour&Co-9.jpg"],
    category: "freshly-baked",
    isNewArrival: true,
    isFeatured: false,
    variants: [
      { name: "Single Serving (Pack of 2)", price: 18.99 },
      { name: "Family Serving (Pack of 4)", price: 32.99 }
    ]
  },
  {
    id: "authentic-butter-chicken",
    name: "Authentic Butter Chicken",
    description: "Tender chicken pieces simmered in our signature rich, creamy butter chicken gravy, encased in golden flaky pastry.",
    price: 22.99,
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    images: ["/products/PHOTOS_Flavour&Co-3.jpg", "/products/PHOTOS_Flavour&Co-8.jpg"],
    badge: "220g",
    category: "freshly-baked",
    isBestSeller: true,
    isFeatured: true,
    variants: [
      { name: "Single Serving (Pack of 2)", price: 22.99 },
      { name: "Family Serving (Pack of 4)", price: 39.99 }
    ]
  },
  {
    id: "lamb-keema",
    name: "Lamb Keema",
    description: "Slow-cooked spiced minced lamb with homemade roasted spices for a deep, authentic Indian heritage flavour.",
    price: 22.99,
    image: "/products/PHOTOS_Flavour&Co-5.jpg",
    images: ["/products/PHOTOS_Flavour&Co-5.jpg", "/products/PHOTOS_Flavour&Co-4.jpg"],
    badge: "220g",
    category: "freshly-baked",
    isBestSeller: true,
    isFeatured: true,
    variants: [
      { name: "Single Serving (Pack of 2)", price: 22.99 },
      { name: "Family Serving (Pack of 4)", price: 39.99 }
    ]
  },
  {
    id: "grazing-box",
    name: "Grazing Box",
    description: "The ultimate entertainer's grazing box filled with a selection of our premium fusion party pies and signature dips.",
    price: 75.00,
    image: "/products/PHOTOS_Flavour&Co-7.jpg",
    images: ["/products/PHOTOS_Flavour&Co-7.jpg", "/products/PHOTOS_Flavour&Co-9.jpg"],
    category: "grazing-box",
    isFeatured: true,
    variants: [
      { name: "Standard Box", price: 75.00 },
      { name: "Deluxe Feast Box", price: 135.00 }
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
