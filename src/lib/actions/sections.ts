"use server";

import prisma from "../db/prisma";
import { err } from "../result";
import { ErrorCode } from "../errors";
import { ShopSection } from "../types/store-section";
import { assertOwnsShop } from "../auth/assert-owns-shop";

export async function saveSections(
  shopId: string,
  pageType: string,
  sections: ShopSection[],
) {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
      message: "საჭიროა მაღაზიის ID",
      status: 400,
    });
  }
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.$transaction([
    prisma.shopSection.deleteMany({
      where: { shopId, pageType },
    }),
    prisma.shopSection.createMany({
      data: sections.map((s, i) => ({
        id: s.id,
        shopId,
        type: s.type,
        props: s.props,
        order: i,
        pageType,
      })),
    }),
  ]);
}
