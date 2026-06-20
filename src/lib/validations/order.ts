import { z } from "zod";

export const orderSchema = z.object({
  fullName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  line1: z.string().min(1, "Required"),
  line2: z.string().optional(),
  city: z.string().min(1, "Required"),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
