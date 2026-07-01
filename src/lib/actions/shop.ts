"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { err, ok } from "../result";
import { ErrorCode } from "../errors";
import prisma from "../db/prisma";
import { redirect } from "next/navigation";
import { getThemeConfig } from "@/themes";
import { assertOwnsShop } from "../auth/assert-owns-shop";

export type ShippingZone = { city_en: string; city_ka: string; rate: number };

export async function updateShipping(
  shopId: string,
  data: { shippingRate: number; freeThreshold: number; shippingZones: ShippingZone[] },
) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }
  await prisma.shop.update({ where: { id: shopId }, data });
}

export async function updateShopTheme(shopId: string, themeId: string) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }
  const { defaults } = getThemeConfig(themeId);
  await prisma.shop.update({ where: { id: shopId }, data: { themeId, ...defaults } });
}

export async function updateShop(
  shopId: string,
  data: { name: string; description?: string; currency: string; logo?: string },
) {
  if (!shopId || !data.name || !data.currency)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required fields", status: 400 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: {
      name: data.name,
      description: data.description || null,
      currency: data.currency,
      logo: data.logo || null,
    },
  });

  return ok(shop);
}

export const createShop = async (name: string, slug: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  if (!name || !slug) return;

  const existing = await prisma.shop.findFirst({ where: { ownerId: session.user.id } });
  if (existing) return err({ code: "SHOP_ALREADY_EXISTS", message: "You already have a shop.", status: 400 });

  try {
    const shop = await prisma.shop.create({
      data: {
        ownerId: session.user.id,
        name,
        slug,
      },
    });

    await prisma.shopSection.createMany({
      data: [
        {
          shopId: shop.id,
          type: "navbar",
          order: 0,
          props: {
            items: [],
            transparent: false,
          },
        },
        {
          shopId: shop.id,
          type: "banner",
          order: 1,
          props: {
            title: `Welcome to ${name}`,
            subtitle: "Discover our latest collection",
            image: "",
            buttonText: "Shop Now",
            href: "#",
            variant: "cover",
          },
        },
        {
          shopId: shop.id,
          type: "rich-text",
          order: 2,
          props: {
            title: "Our Story",
            body: "Tell customers about your brand and what makes you unique.",
            align: "center",
          },
        },
        {
          shopId: shop.id,
          type: "newsletter",
          order: 3,
          props: {
            title: "Stay in the loop",
            subtitle: "Get notified about new products and exclusive offers.",
            buttonText: "Subscribe",
            variant: "banner",
          },
        },
      ],
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
