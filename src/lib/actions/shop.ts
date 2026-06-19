"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { err, ok } from "../result";
import prisma from "../db/prisma";
import { redirect } from "next/navigation";

export const createShop = async (name: string, slug: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  if (!name || !slug) return;

  try {
    const shop = await prisma.shop.create({
      data: {
        ownerId: session.user.id,
        name,
        slug,
      },
    });

    return ok(shop);
  } catch {
    return err({
      code: "SHOP_CREATE_FAILED",
      message: "მაღაზიის მისამართი უკვე დაკავებულია.",
      status: 400,
    });
  }
};
