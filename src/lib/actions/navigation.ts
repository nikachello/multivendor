"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { NavItem } from "../types/sections";
import { assertOwnsShop } from "../auth/assert-owns-shop";

export async function saveNavigation(shopId: string, items: NavItem[]) {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID required", status: 400 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const navbarSection = await prisma.shopSection.findFirst({
    where: { shopId, type: "navbar" },
  });

  if (!navbarSection) return err({ code: ErrorCode.GENERAL_ERROR, message: "Navbar section not found", status: 404 });

  await prisma.shopSection.update({
    where: { id: navbarSection.id },
    data: { props: { ...(navbarSection.props as object), items } },
  });

  return ok(null);
}

export async function saveFooterNavigation(shopId: string, items: NavItem[]) {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID required", status: 400 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const existing = await prisma.shopSection.findFirst({
    where: { shopId, type: "footerNav" },
  });

  if (existing) {
    await prisma.shopSection.update({
      where: { id: existing.id },
      data: { props: { items } },
    });
  } else {
    await prisma.shopSection.create({
      data: { shopId, type: "footerNav", order: 999, props: { items } },
    });
  }

  return ok(null);
}
