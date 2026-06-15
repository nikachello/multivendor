"use server";

import prisma from "../db/prisma";
import { err } from "../result";
import { ErrorCode } from "../errors";

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

  await prisma.shop.update({
    where: { id: shopId },
    data: theme,
  });
}
