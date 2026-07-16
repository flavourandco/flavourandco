// Media asset registry for Flavour & Co.

export const media = {
  logo: "/brand_logo.png",
  heroVideo: "/pies.mp4",
  
  // High-quality pie and bakery images from Unsplash
  products: {
    butterChicken: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80", // Meat Pie
    samosaPie: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80", // Spiced potatoes/samosa style
    lambKeema: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", // Savory pie
    paneerTikka: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80", // Indian curry paneer look
  },

  moods: {
    gather: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80",
    celebrate: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    unwind: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    entertain: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  },

  about: {
    kitchen: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&q=80",
    baker: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=80",
  }
} as const;

export default media;
