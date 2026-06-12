"use server";

import prisma from "../db/prisma";
import { err } from "../result";
import { ErrorCode } from "../errors";
import { ShopSection } from "../types/store-section";

export async function saveSections(shopId: string, sections: ShopSection[]) {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
      message: "საჭიროა მაღაზიის ID",
      status: 400,
    });
  }
  if (!sections) {
    return err({
      code: ErrorCode.SECTIONS_MISSING,
      message: "საჭიროა არსებული სექციები",
      status: 400,
    });
  }

  await prisma.$transaction([
    prisma.shopSection.deleteMany({
      where: {
        shopId,
      },
    }),

    prisma.shopSection.createMany({
      data: sections.map((s, i) => ({
        id: s.id,
        shopId,
        type: s.type,
        props: s.props,
        order: i,
      })),
    }),
  ]);
}
