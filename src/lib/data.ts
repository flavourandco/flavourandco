import type { Product, ProductVariant, WhyStandOutPoint, BlogPost, ReviewItem } from "./types";

export type { Product, ProductVariant, WhyStandOutPoint, BlogPost, ReviewItem };

export const marqueeItems = [
  "plate of origin on channel 7",
  "indo-australian pies",
  "sydney-wide delivery",
  "handcrafted by simran",
  "authentic heritage spices",
  "made with love",
] as const;

export const tickerItems = [
  "plate of origin",
  "indo-australian",
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

export const wholesaleBrands = [
  { name: "The Fullerton Hotel Sydney", logo: "/partner-1.png" },
  { name: "Sheraton Grand Sydney", logo: "/partner-2.png" },
  { name: "Amora Hotel Jamison", logo: "/partner-3.png" },
];

export const wholesaleTestimonials = [
  {
    quote: "Flavour & Co.'s butter chicken pies have been a huge hit on our catering menus.",
    author: "Executive Chef",
    company: "Luxury Hotel Group",
  },
];

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
    answer: "Our pies are available both freshly baked and frozen.\n\nFreshly baked pies are perfect for immediate consumption or event catering, while our frozen packs allow you to store and heat them at your convenience at home."
  },
  {
    id: "faq-2",
    question: "How do I heat frozen pies at home?",
    answer: "For best results, heat from frozen in a preheated oven at 180°C (350°F) for 15–20 minutes, or until the pastry is golden and crisp and the filling is piping hot throughout.\n\nDetailed heating instructions are also provided on the product packaging."
  },
  {
    id: "faq-3",
    question: "What is the shelf life of your products?",
    answer: "Frozen pies can be kept in your freezer for up to 3 months.\n\nFreshly baked pies should be refrigerated upon arrival and consumed within 3–4 days."
  },
  {
    id: "faq-4",
    question: "Where do you deliver?",
    answer: "We deliver fresh and frozen orders directly to your door across Australia. Customers can choose freshly baked or frozen packs directly when selecting their pies."
  },
  {
    id: "faq-5",
    question: "How are orders packaged for shipping?",
    answer: "All orders are carefully packed in food-grade insulated packaging with temperature control, ensuring your pies arrive at peak temperature and condition — whether you chose freshly baked or frozen packs."
  },
  {
    id: "faq-6",
    question: "What is your signature chutney?",
    answer: "Our signature chutney is a handcrafted sweet and savoury condiment made with authentic spices. It comes included with all Grazing Boxes and is designed to perfectly complement our pie range."
  },
  {
    id: "faq-7",
    question: "Are any of your products vegetarian?",
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

export { sortProductsByCustomOrder } from "./utils";
