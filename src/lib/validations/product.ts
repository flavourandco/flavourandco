import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  tagline: z.string().optional(),
  shortDescription: z.string().min(5, "Short description is required"),
  description: z.string().min(10, "Full description is required"),
  whyStandOut: z.array(z.object({
    title: z.string(),
    text: z.string()
  })).optional().default([]),
  productDetails: z.array(z.string()).optional().default([]),
  packInfo: z.string().default("Pack of 12"),
  price: z.number().positive("Price must be a positive number"),
  image: z.string().min(1, "Image path or URL is required"),
  images: z.array(z.string()).optional().default([]),
  badge: z.string().optional(),
  category: z.enum(["freshly-baked", "frozen", "grazing-box"]),
  variants: z.array(z.object({
    name: z.string(),
    price: z.number()
  })).optional().default([]),
  preparationOptions: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof ProductSchema>;
