import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens",
    ),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
