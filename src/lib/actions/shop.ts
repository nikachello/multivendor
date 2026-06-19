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
