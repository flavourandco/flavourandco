import { z } from "zod";

export const BlogSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2, "Slug is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().min(5, "Excerpt is required"),
  content: z.array(z.string()).min(1, "At least one paragraph of content is required"),
  writer: z.string().min(2, "Writer name is required"),
  date: z.string().min(2, "Date is required"),
  readTime: z.string().default("3 min read"),
  category: z.string().default("General"),
  image: z.string().min(1, "Main image is required"),
  image2: z.string().optional(),
  authorAvatar: z.string().optional(),
  published: z.boolean().default(true),
});

export type BlogInput = z.infer<typeof BlogSchema>;
