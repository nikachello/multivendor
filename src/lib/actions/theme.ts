"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { assertOwnsShop } from "../auth/assert-owns-shop";

export type ThemeData = {
  primaryColor: string;
  secondaryColor: string;
  pageBackground: string;
  fontFamily: string;
  borderRadius: string;
};

export async function saveTheme(shopId: string, theme: ThemeData) {
  if (!shopId) {
    return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID is required", status: 400 });
  }

  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.shop.update({
    where: { id: shopId },
    data: theme,
  });
  return ok(null);
}
