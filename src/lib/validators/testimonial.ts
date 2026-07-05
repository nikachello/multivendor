import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  position: z.string().max(100).optional(),
  testimony: z.string().min(1, "Testimony is required").max(2000),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
  productId: z.string().nullable().optional(),
});
