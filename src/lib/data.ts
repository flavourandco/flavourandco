export const marqueeItems = [
  "plate of origin on channel 7",
  "indo-australian fusion pies",
  "delivering sydney-wide",
  "handcrafted by ash & simran",
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
  { label: "About", href: "/our-story" },
  { label: "Catering", href: "/wholesale" },
  { label: "FAQs", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const homeNavLinks = [
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "About", href: "/our-story", hasDropdown: true },
] as const;

export const products = [
  {
    id: "butter-chicken-pie-2",
    name: "Flavour & Co. Butter Chicken Pie - Pack of 2",
    description:
      "Tender chicken pieces simmered in our signature rich, creamy butter chicken gravy, encased in golden flaky pastry.",
    price: 22.99,
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    badge: "Plate of Origin Special",
  },
  {
    id: "keema-lamb-pie-2",
    name: "Flavour & Co. Keema Lamb Pie - Pack of 2",
    description:
      "Slow-cooked spiced minced lamb with homemade roasted spices for a deep, authentic Indian heritage flavour.",
    price: 27.99,
    image: "/products/PHOTOS_Flavour&Co-5.jpg",
    badge: "Best Seller",
  },
  {
    id: "mini-keema-lamb-12",
    name: "Flavour & Co. Mini Keema Lamb Pies - Pack of 12",
    description:
      "Bite-sized miniature keema lamb pies infused with heritage spices. Delivered frozen and perfect for parties.",
    price: 35.99,
    image: "/products/PHOTOS_Flavour&Co-4.jpg",
    badge: "10% OFF FROZEN!",
  },
  {
    id: "grazing-boxes",
    name: "Flavour & Co. Grazing Boxes",
    description:
      "The ultimate entertainer's grazing box filled with a selection of our premium fusion party pies and signature dips.",
    price: 70.00,
    image: "/products/PHOTOS_Flavour&Co-7.jpg",
    badge: "Entertainers Pack",
  },
  {
    id: "samosa-pie-2",
    name: "Flavour & Co. Samosa Pie - Pack of 2",
    description:
      "Crisp, flaky pastry loaded with spiced potatoes, green peas, and Ash & Simran's custom aromatic garam masala blend.",
    price: 18.99,
    image: "/products/PHOTOS_Flavour&Co-6.jpg",
    badge: "Signature Veg",
  },
  {
    id: "mini-butter-chicken-12",
    name: "Flavour & Co. Mini Butter Chicken Pie - Pack of 12",
    description:
      "Miniature party-sized butter chicken pies. Golden pastry outside, creamy rich butter chicken inside. Delivered frozen.",
    price: 31.49,
    image: "/products/PHOTOS_Flavour&Co-8.jpg",
    badge: "10% OFF FROZEN!",
  },
  {
    id: "mini-samosa-12",
    name: "Flavour & Co. Mini Samosa Pies - Pack of 12",
    description:
      "Bite-sized mini samosa pies, featuring spiced potato and pea filling in flaky pastry sheets. A crowd favorite.",
    price: 25.19,
    image: "/products/PHOTOS_Flavour&Co-9.jpg",
    badge: "10% OFF FROZEN!",
  },
] as const;

export const moodCards = [
  {
    title: "Watch & Enjoy",
    description:
      "Enjoy the iconic fusion pies that represented India on Channel 7's Plate of Origin, now delivered right to your couch.",
    image: "/products/PHOTOS_Flavour&Co-7.jpg",
  },
  {
    title: "Family Gatherings",
    description:
      "Celebrate with unique grazing boxes and mini party packs that combine Indian heritage with Australian traditions.",
    image: "/products/PHOTOS_Flavour&Co-8.jpg",
  },
  {
    title: "Effortless Catering",
    description:
      "From holiday feasts to corporate catering, make your next event memorable with pies that start conversations.",
    image: "/products/PHOTOS_Flavour&Co-9.jpg",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Simran and Ash's butter chicken pie is the best fusion food I've ever tasted. The pastry is incredibly flaky and the filling is rich and authentic.",
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
    { label: "Catering", href: "/wholesale" },
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
    description: "Delivering fresh and frozen gourmet pies right to your doorstep, baked fresh by Ash & Simran.",
  },
] as const;
