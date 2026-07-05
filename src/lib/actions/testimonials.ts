"use server";

import prisma from "@/lib/db/prisma";
import { assertOwnsShop } from "@/lib/auth/assert-owns-shop";
import { err, ok } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { testimonialSchema } from "@/lib/validators/testimonial";

export type TestimonialInput = {
  name: string;
  position?: string;
  testimony: string;
  rating?: number;
  isActive?: boolean;
  productId?: string | null;
};

export async function createTestimonial(shopId: string, data: TestimonialInput) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: parsed.error.issues[0]?.message ?? "Invalid testimonial data", status: 400 });

  const testimonial = await prisma.testimonial.create({
    data: {
      shopId,
      name: parsed.data.name,
      position: parsed.data.position ?? null,
      testimony: parsed.data.testimony,
      rating: parsed.data.rating ?? null,
      isActive: parsed.data.isActive ?? true,
      productId: parsed.data.productId ?? null,
    },
  });

  revalidatePath("/dashboard/testimonials");
  return ok(testimonial);
}

export async function updateTestimonial(
  shopId: string,
  testimonialId: string,
  data: TestimonialInput,
) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: parsed.error.issues[0]?.message ?? "Invalid testimonial data", status: 400 });

  const existing = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!existing || existing.shopId !== shopId) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  }

  const testimonial = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: {
      name: parsed.data.name,
      position: parsed.data.position ?? null,
      testimony: parsed.data.testimony,
      rating: parsed.data.rating ?? null,
      isActive: parsed.data.isActive ?? true,
      productId: parsed.data.productId ?? null,
    },
  });

  revalidatePath("/dashboard/testimonials");
  return ok(testimonial);
}

export async function deleteTestimonial(shopId: string, testimonialId: string) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const existing = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!existing || existing.shopId !== shopId) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  }

  await prisma.testimonial.delete({ where: { id: testimonialId } });
  revalidatePath("/dashboard/testimonials");
  return ok(null);
}

export async function toggleTestimonialActive(shopId: string, testimonialId: string, isActive: boolean) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const existing = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!existing || existing.shopId !== shopId) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  }

  const testimonial = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: { isActive },
  });

  revalidatePath("/dashboard/testimonials");
  return ok(testimonial);
}
