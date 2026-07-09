"use server";

import prisma from "@/lib/db/prisma";
import { assertOwnsShop } from "@/lib/auth/assert-owns-shop";
import { ok, err } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { getLegalPageTemplates } from "@/lib/page-templates";
import { revalidatePath } from "next/cache";

const SLUG_RE = /^[a-z0-9-]+$/;

export const generateLegalPages = async (shopId: string) => {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: { name: true, slug: true, owner: { select: { email: true } } },
  });
  if (!shop) return err({ code: ErrorCode.GENERAL_ERROR, message: "Shop not found", status: 404 });

  const templates = getLegalPageTemplates({ name: shop.name, email: shop.owner.email, slug: shop.slug });

  let created = 0;
  let skipped = 0;
  for (const tpl of templates) {
    const existing = await prisma.page.findUnique({ where: { shopId_slug: { shopId, slug: tpl.slug } } });
    if (existing) { skipped++; continue; }
    await prisma.page.create({ data: { shopId, slug: tpl.slug, title: tpl.title, content: tpl.content } });
    created++;
  }

  revalidatePath("/dashboard/pages");
  return ok({ created, skipped });
};

export const createPage = async (shopId: string, data: { title: string; slug: string; content: string }) => {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  if (!data.title.trim())
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Title is required", status: 400 });
  if (!SLUG_RE.test(data.slug))
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Slug may only contain lowercase letters, numbers, and hyphens", status: 400 });

  try {
    const page = await prisma.page.create({ data: { shopId, ...data } });
    revalidatePath("/dashboard/pages");
    return ok(page);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "P2002")
      return err({ code: ErrorCode.GENERAL_ERROR, message: "A page with this slug already exists", status: 409 });
    throw e;
  }
};

export const updatePage = async (
  pageId: string,
  data: { title?: string; content?: string; isPublished?: boolean },
) => {
  const page = await prisma.page.findUnique({ where: { id: pageId }, select: { shopId: true } });
  if (!page) return err({ code: ErrorCode.GENERAL_ERROR, message: "Page not found", status: 404 });

  try { await assertOwnsShop(page.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const updated = await prisma.page.update({ where: { id: pageId }, data });
  revalidatePath("/dashboard/pages");
  return ok(updated);
};

export const deletePage = async (pageId: string) => {
  const page = await prisma.page.findUnique({ where: { id: pageId }, select: { shopId: true } });
  if (!page) return err({ code: ErrorCode.GENERAL_ERROR, message: "Page not found", status: 404 });

  try { await assertOwnsShop(page.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.page.delete({ where: { id: pageId } });
  revalidatePath("/dashboard/pages");
  return ok(null);
};
