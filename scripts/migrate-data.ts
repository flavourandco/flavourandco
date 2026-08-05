import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { media } from "../src/lib/media";

// Load .env file variables
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...val] = trimmed.split("=");
      process.env[key.trim()] = val.join("=").trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const apiKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !apiKey || supabaseUrl.includes("your-supabase")) {
  console.log("ℹ️ Supabase environment variables not configured with active project URL yet.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, apiKey);

const productsData = [
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

const blogsData = [
  {
    id: "blog-1",
    slug: "pies-made-with-heart",
    title: "Pies Made with Heart — Here's Why They’re Different",
    writer: "Simran Gulati",
    authorAvatar: "/founder/simran-kitchen.jpg",
    date: "Jul 31, 2025",
    readTime: "2 min read",
    category: "Heritage & Flavour",
    image: media.blogs.blog1_main,
    excerpt:
      "Experience the enchanting fusion of Indian spices and Aussie flair in every bite. Get ready for a flavour celebration!",
    content: [
      "Experience the enchanting fusion of Indian spices and Aussie flair in every bite. Get ready for a flavour celebration! 🤩🥧",
      "Picture the warmth of Indian spices mingling with the homely comfort of Australian favourites, creating a symphony of taste that's both exciting and familiar. Our pies aren't just food—they're conversation starters, cultural bridges, and reasons to gather with friends and family to share stories and laughter. Imagine sitting around a table, the enticing aroma wafting through the air as everyone anticipates the first bite. Each pie we create offers a unique taste adventure, meticulously crafted to ensure every flavour stands out while blending harmoniously with others. Our chefs pay extraordinary attention to detail, selecting the freshest ingredients and perfecting recipes that combine zest and comfort in perfect harmony. Whether you're craving the zing of aromatic spices that awaken your senses or the buttery goodness of a classic pie crust that melts in your mouth, this fusion delivers a culinary masterpiece waiting to be savoured. Each bite promises not just a burst of joy but also a sprinkle of magic, inviting you to a world where spice and delight coexist seamlessly, enhancing the experience with every slice of heaven.",
      "Beyond their delightful taste, our pies tell stories—stories of tradition meeting innovation, of rich Indian heritage intersecting with the laid-back spirit of Australia, painting a picture of culinary artistry that transcends norms. With every slice, you're not just tasting food; you're experiencing a narrative, a culinary journey that transcends borders, appealing to the senses and emotions alike. It's an invitation to indulge in something wonderfully new yet comfortingly familiar, appealing to both the adventurous palate and the traditionalist at heart.",
      "This fusion celebrates diversity and unity, bringing together the best of both worlds in a delectable offering that's hard to resist. Embrace this unique blend, gather around the table filled with laughter and camaraderie, and let our pies be the centrepiece of your next memorable gathering, sparking moments of togetherness and unforgettable memories."
    ]
  },
  {
    id: "blog-2",
    slug: "my-team-india-supports-national-backyard-cricket-day",
    title: "My Team India Supports National Backyard Cricket Day",
    writer: "Ash Gulati",
    authorAvatar: "/founder/simran-coloured.jpg",
    date: "Jan 27, 2021",
    readTime: "1 min read",
    category: "Community & Cause",
    image: media.blogs.blog2_main,
    image2: media.blogs.blog2_sub,
    excerpt:
      "Go to www.nationalbackyardcricket.com and support #Nationalbackyardcricket by picking up a bat and #BattingForChange.",
    content: [
      "Go to www.nationalbackyardcricket.com and support #Nationalbackyardcricket by picking up a bat and #BattingForChange.",
      "Cricket is something that India is known for, and it is definitely THE sport here in Australia. Whenever there is a match between the 2 countries, we are torn between who to go for. Simran tends to push for India and me & the kids root for Australia. Nevertheless, we don’t get too high or too low regardless of the outcome because it’s about celebration of the sport and the bond that is created between the 2 countries.",
      "National Backyard Cricket is another initiative that My Team India fully supports. The great cause supports libraries across regional Australia via partnership with Friends of Libraries Australia as well as tertiary education projects in India, Sri Lanka, Nepal, Tanzania, South Africa, Afghanistan and Indonesia.",
      "This Sunday January 31, 2021 is the official date for National Backyard Cricket day and it is where we will put down our tongs and spatula down and enjoy a game of cricket with our friends and family. Needless to say that our Samosa Pies will be the official snack for this day.",
      "Go to www.nationalbackyardcricket.com and support #Nationalbackyardcricket by picking up a bat and #BattingForChange. It’s for a good cause and you can be healthy while helping these programs that help spread education which is the future for tomorrows children.",
      "No matter if you root for India or Australia, this cause helps both countries and more and the best part is we are doing it together no matter where you are from."
    ]
  },
  {
    id: "blog-3",
    slug: "plate-of-india",
    title: "Plate of India",
    writer: "Nandita Chakraborty",
    date: "Oct 18, 2020",
    readTime: "5 min read",
    category: "Media & Journey",
    image: media.blogs.blog3_main,
    image2: media.blogs.blog3_sub,
    excerpt:
      "In any competition, it is not about how complex your dish is but how plain, simple and flavourful your dish is. That’s the spirit of ‘Team India’ of Plate of Origin on Channel 7.",
    content: [
      "In any competition, it is not about how complex your dish is but how plain, simple and flavourful your dish is. That’s the spirit of ‘Team India’ of Plate of Origin on Channel 7.",
      "A loud cheer of “Vandemataram!” evokes Simran’s patriotism as she declares her love for India on national television for the televised cooking competition Plate of Origin.",
      "In a candid interview, Ash and Simran speak about their love for food and their journey together – a love story which has all the narratives of DDLJ. When meeting Simran in 2004, it was love at first sight for Ash. He wants to be as close to her as possible – meaning he has to join her in a cooking show, no matter how uncomfortable it is for him to cook in front of a camera. Ash’s accent can be American but he is the modern Raj with his perfect Hindi, which brings a smile to my face.",
      "He declares to Simran that she is the first and last woman for him. It is all about him being the luckiest man on earth to have her – and even if it is a cooking show, why not? To that Simran says with a laugh, “It’s all about him.” Ash is originally from the US, but met Simran in Delhi; they’ve been married for fourteen years, and it has been six years since they moved to Sydney with their two beautiful kids.",
      "It’s a beautiful transition for Ash, from working as a corporate strategist in a software company to making samosa pie on national television, all credit going to Simran. The recipes she has been developing, experimenting with and cooking have been passed down from her family. Ash tells me cooking as therapy is far better than opening that bottle of whisky.",
      "Simran always loved the glamour and fashion of Bollywood and wanted to be part of the industry. Her journey started in Australia in 2016. Coming out of a break from being a full-time mum, she turned heads in Mrs India Australia in 2016 when she was the first runner-up. Many avenues opened up, including acting and modelling. Having two kids made her health-conscious, so Simran also became an advocate of health and fitness. The turning point for her career was winning the Mrs India Global beauty pageant in 2018. Global Indian Talent wanted an ambassador for their brand to represent them at Cannes Film Festival – who would have been better than Simran? It was a great opportunity. As they say, one thing leads to the other; one of her peers also suggested for her to audition for Plate of Origin.",
      "So, there she was at the audition by herself; she hadn’t known that she would have to team up with someone. So, without any hesitation, she went straight home to speak to Ash and persuade him to join. A nervous Ash recollects saying to Simran that he is always a behind-the-scenes guy. For him to go to the cooking show meant he not only has to be ‘in front of the house’ but he has to cook too!",
      "In the kitchen, both of them cook but the innovative one (and a better cook, in own Ash’s words) is Simran. They bounce off each other beautifully. Simran loves to cook Indian food and Ash has a more diverse palate; next time you are on their Instagram page and see something different, that’s all Ash. But the ‘samosa pie’ idea was entirely Simran. She says that if we can have a tandoori pie, why not twist the infamous street snack samosa into a pie? When I saw them baking that samosa pie, I was already salivating (the next day, I had to settle for a chicken pie, unfortunately).",
      "While their dream is to open a food truck, their whole take from this journey is to make the Indian community proud and leave their footprints for others to follow. In my twenty-one years in Melbourne, I haven’t seen an Indian couple taking the stage. The diverse show Plate of Origin enables that.",
      "Asking Ash and Simran if they would have done something different to the butter chicken in the episode that had them eliminated from the competition, they replied they’d probably have started the sauce with a prep time of 90 minutes rather than 60 minutes. They had limited time and choices, like no use of a pressure cooker. They were given the list of what they had to cook, which is what makes the challenge so intriguing. Simran would have cooked a nice hot roti fresh from the tandoor or a simple chicken curry, but chicken biryani was the order of the day.",
      "Like everything else during the pandemic, things changed – Channel 7 had to cut the show back and it became a double elimination format. They were meant to showcase a lot of other dishes, but the show had to wrap up.",
      "But Ash and Simran still cannot get over the first call, when they were told that they made it onto the show. I’m told they recorded it.",
      "Team India is all about showcasing their heritage. One scene we didn’t see in the show was her tears welling up when the flag of India was flying high. From teaching the Punjabi cheer, “Bale! Bale!” to her fellow contestants to saving up emotions for mother India, I say that’s what makes her so special. Her beauty and her creativity come out in the food.",
      "But I think if Simran took the show’s attention with her glamour, Ash definitely brought his warmth as a charming “one-woman man”. I couldn’t be happier to learn this show could be streamed on Hotstar, as it will prove to be a valuable lesson. A woman’s place is in a man’s heart, but the place in the kitchen belongs to both of them. Food and love can combine to win everything in life, even during a pandemic.",
      "Their heritage, their simplicity in itself is them on a plate. This is only the start of a legacy, weaving a path to all the Australian Indians who have migrated here; diversity is finally taking shape.",
      "Simran is creative with her healthy way of life, teaching her children (aged eight and ten) that Indian paratha can be as fun as a burger. The technique is the same – just swapping desi ghee with coconut oil, replacing flour with ragi and making Indian food delicious and healthy for a sustainable life.",
      "They both say they are doing more stuff with Channel 7 – it is perhaps the end of a beginning.",
      "Blowing kisses to Simran (and she vice-versa), she bids a goodbye from her lounge to mine. I look at Ash’s Simran and Simran’s Ash, quoting Julia Child the American chef from her book My Life in France: “The secret of a happy marriage is finding the right person. You know they’re right if you love to be with them all the time.”",
      "By Nandita Chakraborty — This story was featured in the October 2020 edition of G'day India and The Indian Weekly."
    ]
  },
  {
    id: "blog-4",
    slug: "rich-history-of-samosa",
    title: "Rich History of Samosa",
    writer: "Simran Gulati",
    authorAvatar: "/founder/simran-kitchen.jpg",
    date: "Oct 15, 2020",
    readTime: "2 min read",
    category: "Food History",
    image: media.blogs.blog4_main,
    image2: media.blogs.blog4_sub,
    excerpt:
      "As it turns 6pm in Karol Bagh in Delhi, street vendors are serving up one of the most humble street snacks in India; Samosa. Discover the ancient royal history behind this beloved icon.",
    content: [
      "As it turns 6pm in Karol Bagh in Delhi, the nightfall is coming on a December chilly evening, street vendors have lights around their stalls each screaming to get customers attention so they can make their ends meet. 6pm means snack time, and street vendors are gearing up for the rush hour, and one of those street vendors is serving up one of the most humble street snacks in India; Samosa.",
      "Widely considered a quintessentially Indian delicacy, few people know that the samosa does not have an Indian origin. The deep fried, tightly packed parcel of spicy goodness that people think belongs to India is actually from Central Asia.",
      "The samosa’s origins are from thousands of miles away in the ancient empires that came up in Iran at the time of civilisation. There is mention of sanbosag, from 10th century Middle Eastern cuisine in early medieval Persian texts as a relative of samosa and a cousin of the Persian pastry, samsa.",
      "In India, Samosa was introduced by the Middle Eastern chefs who migrated for employment during the Delhi Sultanate rule, having earned the blessings and love of the Indian royals, the samosa became a snack fit for the king. There are also traces that have been validated by famed poet Amir Khusrau; the samosa being enjoyed by nobles in the royal Indian courts in the year 1300.",
      "The British fell in love with the samosa on their arrival in India and they, along with the Indian diaspora, took the tasty tidbit with them to the far corners of their colonial empire. The samosa settled in the hearts of people everywhere, leading to the evolution of multiple regional versions that are enjoyed by all.",
      "There are a number of variations in India, all of them served with chutneys. According to samosa connoisseurs, a samosa is deemed perfect when there is a crispy-crunch of light golden pastry paired with soft texture and spicy taste of the filling.",
      "The samosa is undoubtedly the brightest star of Indian street food. When you bite into a gorgeous, golden samosa, what you taste is the story of India – a melting pot of cultures, cuisines and cooking traditions.",
      "Now that we know the origin of Samosa, we have taken it another level up to make this into a pie, do try Team India's samosa pie as we carry the tradition of this great Indian street food forward."
    ]
  }
];

const testimonialsData = [
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

async function migrate() {
  console.log("🚀 Starting database migration to Supabase...");
  console.log(`Connecting to: ${supabaseUrl}`);

  // 1. Migrate Products
  console.log(`📦 Migrating ${productsData.length} products to Supabase...`);
  for (const p of productsData) {
    const record = {
      id: p.id,
      name: p.name,
      tagline: p.tagline || "",
      short_description: p.shortDescription || "",
      description: p.description || "",
      why_stand_out: p.whyStandOut || [],
      product_details: p.productDetails || [],
      pack_info: p.packInfo || "Pack of 12",
      price: p.price,
      image: p.image,
      images: p.images || [p.image, p.image],
      badge: p.badge || null,
      category: p.category,
      variants: p.variants || [],
      preparation_options: p.preparationOptions || [],
      is_featured: Boolean(p.isFeatured),
      is_best_seller: Boolean(p.isBestSeller),
      is_new_arrival: Boolean(p.isNewArrival),
    };

    const { error } = await supabase.from("products").upsert(record, { onConflict: "id" });
    if (error) {
      console.error(`❌ Failed product upsert (${p.id}):`, error.message);
    }
  }
  console.log("✅ Products migration completed.");

  // 2. Migrate Blogs
  console.log(`📝 Migrating ${blogsData.length} blog posts (authorRole removed)...`);
  for (const b of blogsData) {
    const record = {
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt || "",
      content: b.content || [],
      writer: b.writer || "Simran Gulati",
      date: b.date || "",
      read_time: b.readTime || "3 min read",
      category: b.category || "General",
      image: b.image,
      image2: b.image2 || null,
      author_avatar: b.authorAvatar || null,
      published: true,
    };

    const { error } = await supabase.from("blogs").upsert(record, { onConflict: "id" });
    if (error) {
      console.error(`❌ Failed blog upsert (${b.id}):`, error.message);
    }
  }
  console.log("✅ Blogs migration completed.");

  // 3. Migrate Reviews
  console.log(`⭐ Migrating ${testimonialsData.length} customer reviews...`);
  for (const t of (testimonialsData as unknown as any[])) {
    const record = {
      name: t.author || t.name || "Happy Customer",
      rating: t.rating || 5,
      comment: t.quote || t.comment || "",
      is_verified: true,
      status: "approved",
    };

    const { error } = await supabase.from("reviews").insert([record]);
    if (error) {
      console.error(`❌ Failed review insert:`, error.message);
    }
  }
  console.log("✅ Customer reviews migration completed.");

  console.log("🎉 ALL DATA SUCCESSFULLY MIGRATED TO SUPABASE!");
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
