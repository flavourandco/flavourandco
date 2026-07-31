export const marqueeItems = [
  "plate of origin on channel 7",
  "indo-australian pies",
  "australia-wide delivery",
  "handcrafted by simran",
  "authentic heritage spices",
  "made with love",
] as const;

export const tickerItems = [
  "plate of origin",
  "indo-australian",
  "australia-wide delivery",
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

export interface WhyStandOutPoint {
  title: string;
  text: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string; // short italic/lede line under the title, from source copy
  shortDescription: string; // 1-liner for cards/listing grids
  description: string; // full paragraph description, from source copy
  whyStandOut: WhyStandOutPoint[]; // "Why they stand out" section
  productDetails: string[]; // bullet list, from source copy
  packInfo: string; // e.g. "Pack of 12", "Pack of 2", matches xlsx "Info" column
  price: number; // base price (matches variants[0].price)
  image: string; // base image (matches images[0])
  images: [string, string]; // [normal, hover]
  badge?: string;
  category: "freshly-baked" | "frozen" | "grazing-box";
  variants: ProductVariant[];
  preparationOptions?: string[];

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
  // ─────────────────────────────────────────────────────────
  // MINI PIES — Pack of 12 (55g each) — Freshly Baked / Frozen
  // ─────────────────────────────────────────────────────────
  {
    id: "mini-authentic-butter-chicken",
    name: "Mini Authentic Butter Chicken Pies",
    tagline: "A crowd favourite, reimagined in bite-sized form.",
    shortDescription: "Slow-cooked chicken thigh fillets in a rich, velvety butter chicken sauce, wrapped in golden flaky pastry.",
    description:
      "Our Mini Authentic Butter Chicken Pies combine slow-cooked chicken thigh fillets with a rich, velvety butter chicken sauce, wrapped in golden flaky pastry for the perfect balance of comfort and flavour. Ideal for entertaining, grazing tables, events, or elevated everyday snacking.",
    whyStandOut: [
      { title: "Slow-Cooked Flavour", text: "Tender chicken thigh fillets simmered in our signature butter chicken sauce for deep, layered flavour in every bite." },
      { title: "Made in Australia", text: "Crafted in small batches for quality you can taste." },
      { title: "No Artificial Preservatives", text: "Made with carefully selected ingredients and no unnecessary additives." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "12 mini pies per pack (55g each)",
      "Signature butter chicken filling",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 12",
    price: 34.99,
    image: "/products/butter-chicken-pie.png",
    images: ["/products/butter-chicken-pie.png", "/products/PHOTOS_Flavour&Co-3.jpg"],
    badge: "Best Seller",
    category: "frozen",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    variants: [
      { name: "Freshly Baked", price: 34.99 },
      { name: "Frozen", price: 34.99 },
    ],
    preparationOptions: ["Freshly Baked", "Frozen"],
  },
  {
    id: "mini-samosa",
    name: "Mini Samosa Pies",
    tagline: "A modern take on a timeless favourite.",
    shortDescription: "Savoury spiced potato and green pea filling wrapped in flaky golden pastry.",
    description:
      "Our Mini Samosa Pies feature a savoury filling of spiced potato and green peas, wrapped in flaky golden pastry for the perfect balance of warmth, texture, and flavour. Designed for entertaining, grazing tables, catering, and effortless everyday snacking.",
    whyStandOut: [
      { title: "Inspired by Traditional Samosa Flavours", text: "A fragrant blend of spiced potato and green peas, crafted for rich, balanced flavour in every bite." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "100% Vegetarian & Egg-Free", text: "Made to suit a wide range of dietary preferences without compromising on flavour." },
      { title: "No Artificial Preservatives", text: "Clean, quality ingredients with nothing unnecessary added." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "12 mini pies per pack (55g each)",
      "Savoury spiced potato and green pea filling",
      "Wrapped in flaky golden pastry",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 12",
    price: 27.99,
    image: "/products/PHOTOS_Flavour&Co-6.jpg",
    images: ["/products/PHOTOS_Flavour&Co-6.jpg", "/products/PHOTOS_Flavour&Co-9.jpg"],
    category: "frozen",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    variants: [
      { name: "Freshly Baked", price: 27.99 },
      { name: "Frozen", price: 27.99 },
    ],
    preparationOptions: ["Freshly Baked", "Frozen"],
  },
  {
    id: "mini-lamb-keema",
    name: "Mini Lamb Keema Pies",
    tagline: "Bold Indian flavours, wrapped in flaky golden pastry.",
    shortDescription: "Premium Australian lamb, gently cooked with aromatic herbs and spices, encased in crisp golden pastry.",
    description:
      "Our Mini Lamb Keema Pies are filled with premium Australian lamb, gently cooked with aromatic herbs and spices to create a rich, savoury filling, all encased in crisp, flaky golden pastry. Perfect for entertaining, grazing tables, catering, parties, or an easy gourmet snack at home.",
    whyStandOut: [
      { title: "Authentic Indian-Inspired Keema", text: "Made with premium Australian lamb, slow cooked with a carefully balanced blend of traditional herbs and spices for a rich, comforting flavour." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "Premium Australian Lamb", text: "Using quality Australian lamb to deliver a deliciously tender and flavourful filling." },
      { title: "No Artificial Preservatives", text: "Clean, quality ingredients with nothing unnecessary added." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "12 mini pies per pack (55g each)",
      "Premium Australian lamb keema filling",
      "Aromatic Indian herbs and spices",
      "Wrapped in flaky golden pastry",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 12",
    price: 39.99,
    image: "/products/PHOTOS_Flavour&Co-7.jpg",
    images: ["/products/PHOTOS_Flavour&Co-7.jpg", "/products/PHOTOS_Flavour&Co-4.jpg"],
    category: "frozen",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    variants: [
      { name: "Freshly Baked", price: 39.99 },
      { name: "Frozen", price: 39.99 },
    ],
    preparationOptions: ["Freshly Baked", "Frozen"],
  },
  {
    id: "mini-achari-paneer-pie",
    name: "Mini Achari Paneer Pies",
    tagline: "A tangy, spiced twist on a classic favourite.",
    shortDescription: "Cottage cheese cooked in aromatic pickled achari spices, wrapped in golden pastry.",
    description:
      "Our Mini Achari Paneer Pies are filled with soft paneer cooked in a tangy, aromatic achari spice blend, wrapped in golden flaky pastry for a bold and satisfying bite. Ideal for entertaining, grazing tables, events, or elevated everyday snacking.",
    whyStandOut: [
      { title: "Bold Achari Spice Blend", text: "A tangy, pickled-spice profile that sets it apart from the everyday paneer filling." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "100% Vegetarian", text: "Made to suit a wide range of dietary preferences without compromising on flavour." },
      { title: "No Artificial Preservatives", text: "Made with carefully selected ingredients and no unnecessary additives." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "12 mini pies per pack (55g each)",
      "Spiced achari paneer filling",
      "Wrapped in flaky golden pastry",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 12",
    price: 34.99,
    image: "/products/mini-achari-paneer.png",
    images: ["/products/mini-achari-paneer.png", "/products/mini-achari-paneer.png"],
    category: "frozen",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    variants: [
      { name: "Freshly Baked", price: 34.99 },
      { name: "Frozen", price: 34.99 },
    ],
    preparationOptions: ["Freshly Baked", "Frozen"],
  },
  {
    id: "chicken-tikka-samosa",
    name: "Chicken Tikka Samosas",
    tagline: "Smoky, spiced chicken tikka in a crisp samosa shell.",
    shortDescription: "Succulent chicken tikka in a rich masala filling, wrapped in crispy triangle samosa pastry.",
    description:
      "Our Chicken Tikka Samosas combine succulent chicken tikka with a rich, spiced masala filling, wrapped in crispy triangle samosa pastry for a bold, smoky bite. Ideal for entertaining, grazing tables, events, or elevated everyday snacking.",
    whyStandOut: [
      { title: "Authentic Tikka Masala Flavour", text: "Chicken marinated and cooked in a rich, aromatic masala blend for deep flavour in every bite." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "No Artificial Preservatives", text: "Made with carefully selected ingredients and no unnecessary additives." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "12 mini samosas per pack (55g each)",
      "Chicken tikka masala filling",
      "Wrapped in crispy samosa pastry",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 12",
    price: 39.99,
    image: "/products/chicken-tikka-samosa.png",
    images: ["/products/chicken-tikka-samosa.png", "/products/chicken-tikka-samosa.png"],
    category: "frozen",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    variants: [
      { name: "Freshly Baked", price: 39.99 },
      { name: "Frozen", price: 39.99 },
    ],
    preparationOptions: ["Freshly Baked", "Frozen"],
  },
  {
    id: "paneer-empanada",
    name: "Paneer Empanadas",
    tagline: "A crowd favourite, crimped to perfection.",
    shortDescription: "Crimped crescent pastries stuffed with spiced paneer, green peas, onions, and herbs.",
    description:
      "Our Paneer Empanadas are crimped crescent pastries stuffed with spiced paneer, green peas, onions, and traditional herbs — an artisan snack made for effortless entertaining. Ideal for grazing tables, events, or elevated everyday snacking.",
    whyStandOut: [
      { title: "Heritage-Inspired Filling", text: "A crescent pastry take on a classic paneer filling, blending Indian spice with empanada-style pastry." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "100% Vegetarian", text: "Made to suit a wide range of dietary preferences without compromising on flavour." },
      { title: "No Artificial Preservatives", text: "Made with carefully selected ingredients and no unnecessary additives." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "12 mini empanadas per pack (55g each)",
      "Spiced paneer, green pea, and onion filling",
      "Crimped crescent pastry",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 12",
    price: 24.99,
    image: "/products/paneer-empanada.png",
    images: ["/products/paneer-empanada.png", "/products/paneer-empanada.png"],
    category: "frozen",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    variants: [
      { name: "Freshly Baked", price: 24.99 },
      { name: "Frozen", price: 24.99 },
    ],
    preparationOptions: ["Freshly Baked", "Frozen"],
  },

  // ─────────────────────────────────────────────────────────
  // INDIVIDUAL PIES — Pack of 2 (220g each) — Frozen Only
  // ─────────────────────────────────────────────────────────
  {
    id: "authentic-butter-chicken",
    name: "Authentic Butter Chicken Pies - Individual",
    tagline: "A crowd favourite, reimagined.",
    shortDescription: "Slow-cooked chicken thigh fillets in a rich, velvety butter chicken sauce, wrapped in golden flaky pastry.",
    description:
      "A crowd favourite, reimagined. Our Butter Chicken Pies combine slow-cooked chicken thigh fillets with a rich, velvety butter chicken sauce, wrapped in golden flaky pastry for the perfect balance of comfort and flavour.",
    whyStandOut: [
      { title: "Slow-Cooked Flavour", text: "Tender chicken thigh fillets simmered in our signature butter chicken sauce for deep, layered flavour in every bite." },
      { title: "Made in Australia", text: "Crafted in small batches for quality you can taste." },
      { title: "No Artificial Preservatives", text: "Made with carefully selected ingredients and no unnecessary additives." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "2 pies per pack (220g each)",
      "Signature butter chicken filling",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 2",
    price: 22.99,
    image: "/products/authentic-butter-chicken.png",
    images: ["/products/authentic-butter-chicken.png", "/products/butter-chicken-pie.png"],
    badge: "220g",
    category: "freshly-baked",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    variants: [{ name: "Frozen", price: 22.99 }],
    preparationOptions: ["Frozen"],
  },
  {
    id: "100-vegetarian-samosa",
    name: "Samosa Pies - Individual",
    tagline: "A modern take on a timeless favourite.",
    shortDescription: "Savoury spiced potato and green pea filling wrapped in flaky golden pastry.",
    description:
      "Our Samosa Pies feature a savoury filling of spiced potato and green peas, wrapped in flaky golden pastry for the perfect balance of warmth, texture, and flavour.",
    whyStandOut: [
      { title: "Inspired by Traditional Samosa Flavours", text: "A fragrant blend of spiced potato and green peas, crafted for rich, balanced flavour in every bite." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "100% Vegetarian & Egg-Free", text: "Made to suit a wide range of dietary preferences without compromising on flavour." },
      { title: "No Artificial Preservatives", text: "Clean, quality ingredients with nothing unnecessary added." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "2 pies per pack (220g each)",
      "Savoury spiced potato and green pea filling",
      "Wrapped in flaky golden pastry",
      "No artificial preservatives",
      "Available fresh or frozen",
    ],
    packInfo: "Pack of 2",
    price: 18.99,
    image: "/products/PHOTOS_Flavour&Co-8.jpg",
    images: ["/products/PHOTOS_Flavour&Co-8.jpg", "/products/PHOTOS_Flavour&Co-6.jpg"],
    category: "freshly-baked",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    variants: [{ name: "Frozen", price: 18.99 }],
    preparationOptions: ["Frozen"],
  },
  {
    id: "lamb-keema",
    name: "Lamb Keema Pies - Individual",
    tagline: "Bold Indian flavours, wrapped in flaky golden pastry.",
    shortDescription: "Premium Australian lamb, gently cooked with aromatic herbs and spices, encased in crisp golden pastry.",
    description:
      "Our Lamb Keema Pies are filled with premium Australian lamb, gently cooked with aromatic herbs and spices to create a rich, savoury filling, all encased in crisp, flaky golden pastry.",
    whyStandOut: [
      { title: "Authentic Indian-Inspired Keema", text: "Made with premium Australian lamb, slow cooked with a carefully balanced blend of traditional herbs and spices for a rich, comforting flavour." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "Premium Australian Lamb", text: "Using quality Australian lamb to deliver a deliciously tender and flavourful filling." },
      { title: "No Artificial Preservatives", text: "Clean, quality ingredients with nothing unnecessary added." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "2 pies per pack (220g each)",
      "Premium Australian lamb keema filling",
      "Aromatic Indian herbs and spices",
      "Wrapped in flaky golden pastry",
      "No artificial preservatives",
    ],
    packInfo: "Pack of 2",
    price: 27.99,
    image: "/products/PHOTOS_Flavour&Co-9.jpg",
    images: ["/products/PHOTOS_Flavour&Co-9.jpg", "/products/PHOTOS_Flavour&Co-5.jpg"],
    badge: "220g",
    category: "freshly-baked",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    variants: [{ name: "Frozen", price: 27.99 }],
    preparationOptions: ["Frozen"],
  },

  // ─────────────────────────────────────────────────────────
  // MIXED / GRAZING
  // ─────────────────────────────────────────────────────────
  // Note: no screenshot source for this product — copy kept in the
  // house style/format but not verbatim-sourced. Flag if you have real copy.
  {
    id: "mixed-individual-pack",
    name: "Mixed Individual Pack",
    tagline: "A little bit of everything.",
    shortDescription: "One Butter Chicken, one Samosa, and one Lamb Keema pie — the perfect way to try it all.",
    description:
      "Get a perfect mix of our premium individual pies: one Butter Chicken, one Samosa, and one Lamb Keema. A great way to sample the full range in a single pack.",
    whyStandOut: [
      { title: "Try the Full Range", text: "One of each flavour, so there's no need to choose just one." },
      { title: "Crafted in Small Batches", text: "Made with carefully selected ingredients for quality you can taste." },
      { title: "No Artificial Preservatives", text: "Clean, quality ingredients with nothing unnecessary added." },
      { title: "Handcrafted", text: "Handcrafted in small batches using premium Australian ingredients for quality you can taste in every crimp." },
    ],
    productDetails: [
      "3 pies per pack (220g each)",
      "One Butter Chicken, one Samosa, one Lamb Keema pie",
      "No artificial preservatives",
      "Frozen only",
    ],
    packInfo: "Pack of 3",
    price: 33.0,
    image: "/products/mixed-individual-pack.png",
    images: ["/products/mixed-individual-pack.png", "/products/mixed-individual-pack.png"],
    category: "freshly-baked",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    variants: [{ name: "Frozen", price: 33.0 }],
    preparationOptions: ["Frozen"],
  },
  {
    id: "grazing-box",
    name: "Grazing Box",
    tagline: "Made for sharing. Crafted to impress.",
    shortDescription: "30 signature handcrafted mini pies per box, wrapped in flaky golden pastry — pick your flavour.",
    description:
      "Whether you're entertaining at home, celebrating with family and friends, heading to a picnic, or looking for the perfect gift, our Grazing Boxes make every occasion effortlessly delicious. Each box is filled with our signature handcrafted mini pies, wrapped in flaky golden pastry and made with premium ingredients and bold, unforgettable flavours. Simply heat, serve, and enjoy. Beautifully presented and easy to take anywhere, they're the perfect centrepiece for gatherings or a thoughtful last-minute gift that's guaranteed to be enjoyed. Every box includes our signature chutney for the perfect finishing touch.",
    whyStandOut: [
      { title: "Vegetarian Samosa", text: "30 Mini Samosa Pies filled with a delicious blend of spiced potato and green peas." },
      { title: "Butter Chicken", text: "30 Mini Butter Chicken Pies filled with tender chicken in a rich, creamy tomato sauce infused with authentic Indian spices." },
      { title: "Lamb Keema", text: "30 Mini Lamb Keema Pies made with premium Australian lamb, gently cooked with aromatic herbs and spices." },
      { title: "Mixed Flavour Selection", text: "The best of everything — 10 Mini Samosa Pies, 10 Mini Butter Chicken Pies and 10 Mini Lamb Keema Pies in one box." },
    ],
    productDetails: [
      "30 mini pies per box",
      "Freshly baked only",
      "Includes signature chutney",
      "Choose from Vegetarian Samosa, Butter Chicken, Lamb Keema, or Mixed",
    ],
    packInfo: "Grazing Box (30 pies)",
    price: 70.0,
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    images: ["/products/PHOTOS_Flavour&Co-3.jpg", "/products/PHOTOS_Flavour&Co-4.jpg"],
    category: "grazing-box",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    variants: [
      { name: "Vegetarian Samosa", price: 70.0 },
      { name: "Butter Chicken", price: 90.0 },
      { name: "Lamb Keema", price: 100.0 },
      { name: "Mixed Flavour Selection", price: 90.0 },
    ],
    preparationOptions: ["Freshly Baked"],
  },
];

export const testimonials = [
  {
    quote:
      "Simran's butter chicken pie is the best food I've ever tasted. The pastry is incredibly flaky and the filling is rich and authentic.",
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
      "Representing India on Plate of Origin was no fluke — these pies are pure culinary magic. A perfect blend of Indian spices and classic Australian pies.",
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



export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Are your pies available fresh or frozen?",
    answer: "Yes. Our pies are available fresh or frozen, giving you the flexibility to enjoy them whenever it suits you. Whether you're planning a gathering or stocking the freezer for easy meals, simply heat and serve for delicious results."
  },
  {
    id: "faq-2",
    question: "How do I heat my pies?",
    answer: "Our pies are best heated in a conventional oven or air fryer for peak flaky pastry texture.\n\nPlease note: We do not recommend using a microwave at all due to food safety reasons and to preserve the crisp quality of the pastry. Detailed heating instructions for oven and air fryer are provided on every pack."
  },
  {
    id: "faq-3",
    question: "Do you cater for events?",
    answer: "Absolutely. Our Mini Pies and Grazing Boxes are perfect for birthdays, corporate events, family celebrations, baby showers, sporting events and special occasions of all sizes."
  },
  {
    id: "faq-4",
    question: "What comes in your Grazing Boxes?",
    answer: "Each Grazing Box includes 30 handcrafted Mini Pies and our signature chutney for dipping.\n\nChoose from:\n• Mini Samosa Pies\n• Mini Authentic Butter Chicken Pies\n• Mini Lamb Keema Pies\n• Flavour Selection (a mix of all three)\n\nPerfect for sharing, entertaining or gifting."
  },
  {
    id: "faq-5",
    question: "What are the delivery cost?",
    answer: "We currently offer express delivery Australia-wide through trusted logistics partners, with options for various locations and order values:\n\n• Standard Express Delivery: $15 AUD\n• Free Express Shipping: For orders over $200 nationwide."
  },
  {
    id: "faq-6",
    question: "Do your products contain artificial preservatives?",
    answer: "No. We proudly make our products without artificial preservatives, using carefully selected ingredients to deliver exceptional flavour and quality."
  },
  {
    id: "faq-7",
    question: "Are your pies suitable for vegetarians?",
    answer: "Our Mini Samosa Pies are 100% vegetarian and egg-free.\n\nOur Butter Chicken and Lamb Keema Pies contain meat and are not suitable for vegetarians.\n\nPlease refer to the product packaging for full ingredient and allergen information."
  },
  {
    id: "faq-8",
    question: "Where are your products made?",
    answer: "All Flavour & Co products are proudly made in Australia using premium ingredients and carefully crafted in small batches to ensure consistent quality and flavour."
  },
  {
    id: "faq-9",
    question: "Do you use Australian meat?",
    answer: "Yes. We use premium Australian chicken and Australian lamb in our meat products, sourced from trusted Australian Halal certified suppliers."
  },
  {
    id: "faq-10",
    question: "Where can I buy Flavour & Co products?",
    answer: "You can order directly through our website, and we're continuing to expand into selected retailers, gourmet food stores and specialty stockists across Australia."
  },
  {
    id: "faq-11",
    question: "Do you offer wholesale?",
    answer: "Yes. We proudly supply cafés, caterers, food service providers, independent retailers and specialty stores across Australia.\n\nIf you're interested in becoming a stockist, we'd love to hear from you. Please visit our Wholesale page or contact us for more information."
  },
  {
    id: "faq-12",
    question: "Do you cater for corporate events?",
    answer: "Yes. Our Mini Pies and Grazing Boxes are a popular choice for office lunches, meetings, client events, conferences and corporate celebrations.\n\nWe can accommodate both small and large orders with advance notice."
  },
  {
    id: "faq-13",
    question: "Can I include a gift message with a Grazing Box?",
    answer: "Yes. If you're sending a Grazing Box as a gift, simply include your message at checkout and we'll ensure it's included with your order, making it even more special for the recipient."
  },
  {
    id: "faq-14",
    question: "What allergens do your products contain?",
    answer: "Our products contain gluten (wheat) and may contain other allergens depending on the variety, including milk, egg, soy and sesame.\n\nPlease refer to the product packaging for the full ingredients list and allergen declaration before consuming. If you have a specific dietary concern, we're always happy to help."
  },
  {
    id: "faq-15",
    question: "Can I cook your pies in an air fryer?",
    answer: "Absolutely. Our Mini Pies cook beautifully in an air fryer, giving you crisp, flaky pastry in less time than a conventional oven.\n\nFor best results, follow the heating instructions on the packaging."
  },
  {
    id: "faq-16",
    question: "How many people does a Grazing Box serve?",
    answer: "Our Grazing Boxes include 30 Mini Pies, making them ideal for approximately 6–10 people, depending on the occasion and what else is being served.\n\nThey're perfect for entertaining, family gatherings, office lunches, celebrations and casual get-togethers."
  },
  {
    id: "faq-17",
    question: "What makes Flavour & Co different?",
    answer: "At Flavour & Co, we combine bold, globally inspired flavours with premium Australian ingredients to create food that's both comforting and memorable.\n\nFrom our handcrafted Mini Pies to our ready-to-serve Grazing Boxes, every product is designed to make entertaining effortless without compromising on quality or flavour."
  },
  {
    id: "faq-18",
    question: "Are your products Halal?",
    answer: "Our meat is sourced from suppliers who use Halal-certified meat. However, Flavour & Co products are prepared in a facility that also handles non-Halal ingredients, and our finished products are not Halal certified.\n\nIf you have any questions about our ingredients or production processes, please don't hesitate to contact us."
  }
];

export interface WholesaleBrand {
  id: string;
  name: string;
  logo: string;
  type?: "nike" | "adidas" | "channel7" | "sydneygourmet" | "plateoforigin" | "image";
}

export const wholesaleBrands: WholesaleBrand[] = [
  { id: "b-1", name: "NIKE", logo: "/brands/nike.png", type: "nike" },
  { id: "b-2", name: "ADIDAS", logo: "/brands/adidas.png", type: "adidas" },
  { id: "b-3", name: "CHANNEL SEVEN", logo: "/brands/channel7.png", type: "channel7" },
  { id: "b-4", name: "SYDNEY GOURMET", logo: "/brands/sydney-gourmet.png", type: "sydneygourmet" },
  { id: "b-5", name: "PLATE OF ORIGIN", logo: "/brands/plate-of-origin.png", type: "plateoforigin" },
];

export interface WholesaleTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export const wholesaleTestimonials: WholesaleTestimonial[] = [
  {
    id: "t-1",
    quote: "“Admire your work!”",
    author: "Julie Zhou",
    role: "Founder, Sundial",
    avatar: "/founder/simran-coloured.jpg",
  },
  {
    id: "t-2",
    quote: "“Fan of your pies!”",
    author: "Brian Norgard",
    role: "Ex-CPO Tinder, Norgard",
    avatar: "/founder/simran-kitchen.jpg",
  },
  {
    id: "t-3",
    quote: "“Simran is a very talented baker!”",
    author: "Conner Pope",
    role: "Founder, AdTrace",
    avatar: "/products/PHOTOS_Flavour&Co-3.jpg",
  },
  {
    id: "t-4",
    quote: "“Bakes & delivers FAST!”",
    author: "Ramon Berrios",
    role: "Founder, Castmagic",
    avatar: "/products/PHOTOS_Flavour&Co-2.jpg",
  },
];


