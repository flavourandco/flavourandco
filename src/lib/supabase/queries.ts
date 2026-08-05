import { getSupabaseServerClient, isSupabaseConfigured } from "./server";
import type { Product, BlogPost, ReviewItem } from "@/lib/types";

export async function getProductsServer(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    tagline: item.tagline || "",
    shortDescription: item.short_description || "",
    description: item.description || "",
    whyStandOut: item.why_stand_out || [],
    productDetails: item.product_details || [],
    packInfo: item.pack_info || "Pack of 12",
    price: Number(item.price),
    image: item.image,
    images: item.images || [item.image, item.image],
    badge: item.badge || undefined,
    category: item.category,
    variants: item.variants || [],
    preparationOptions: item.preparation_options || [],
    isFeatured: Boolean(item.is_featured),
    isBestSeller: Boolean(item.is_best_seller),
    isNewArrival: Boolean(item.is_new_arrival),
  }));
}

export async function getProductByIdServer(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    tagline: data.tagline || "",
    shortDescription: data.short_description || "",
    description: data.description || "",
    whyStandOut: data.why_stand_out || [],
    productDetails: data.product_details || [],
    packInfo: data.pack_info || "Pack of 12",
    price: Number(data.price),
    image: data.image,
    images: data.images || [data.image, data.image],
    badge: data.badge || undefined,
    category: data.category,
    variants: data.variants || [],
    preparationOptions: data.preparation_options || [],
    isFeatured: Boolean(data.is_featured),
    isBestSeller: Boolean(data.is_best_seller),
    isNewArrival: Boolean(data.is_new_arrival),
  };
}

export async function getBlogsServer(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || "",
    content: Array.isArray(item.content) ? item.content : [item.content || ""],
    writer: item.writer || "Simran Gulati",
    date: item.date || "",
    readTime: item.read_time || "3 min read",
    category: item.category || "General",
    image: item.image,
    image2: item.image2 || undefined,
    authorAvatar: item.author_avatar || undefined,
    published: item.published ?? true,
  }));
}

export async function getBlogBySlugServer(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || "",
    content: Array.isArray(data.content) ? data.content : [data.content || ""],
    writer: data.writer || "Simran Gulati",
    date: data.date || "",
    readTime: data.read_time || "3 min read",
    category: data.category || "General",
    image: data.image,
    image2: data.image2 || undefined,
    authorAvatar: data.author_avatar || undefined,
    published: data.published ?? true,
  };
}

export async function getApprovedReviewsServer(productId?: string): Promise<ReviewItem[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase
    .from("reviews")
    .select("*, products(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((item) => ({
    id: item.id,
    productId: item.product_id || undefined,
    productName: item.products?.name || "General Testimonial",
    name: item.name,
    rating: item.rating,
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    comment: item.comment,
    isVerified: item.is_verified ?? true,
    status: item.status || "approved",
  }));
}
