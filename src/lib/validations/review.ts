import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  isVerified: z.boolean().default(true),
  status: z.enum(["pending", "approved", "rejected"]).default("approved"),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;
