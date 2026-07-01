"use server";

import prisma from "@/lib/db/prisma";
import { assertOwnsShop } from "@/lib/auth/assert-owns-shop";
import { err, ok } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { revalidatePath } from "next/cache";

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

  const testimonial = await prisma.testimonial.create({
    data: {
      shopId,
      name: data.name,
      position: data.position ?? null,
      testimony: data.testimony,
      rating: data.rating ?? null,
      isActive: data.isActive ?? true,
      productId: data.productId ?? null,
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

  const existing = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!existing || existing.shopId !== shopId) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  }

  const testimonial = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: {
      name: data.name,
      position: data.position ?? null,
      testimony: data.testimony,
      rating: data.rating ?? null,
      isActive: data.isActive ?? true,
      productId: data.productId ?? null,
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
