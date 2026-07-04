"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { err, ok } from "../result";
import { ErrorCode } from "../errors";
import prisma from "../db/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getThemeConfig } from "@/themes";
import { assertOwnsShop } from "../auth/assert-owns-shop";
import type { CollectionConfig } from "../db/queries";
import { isProShop, FREE_THEME } from "../subscription";

export type ShippingZone = { city_en: string; city_ka: string; rate: number };

export async function updateCollectionConfig(shopId: string, shopSlug: string, config: CollectionConfig) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }
  await prisma.shop.update({
    where: { id: shopId },
    data: { collectionConfig: config as never },
  });
  revalidatePath(`/shop/${shopSlug}`, "layout");
  return ok(null);
}

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
  if (themeId !== FREE_THEME) {
    const shopData = await prisma.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
    if (!isProShop(shopData?.subscriptionPaidUntil)) {
      throw new Error("Pro subscription required to use this theme.");
    }
  }
  const { defaults } = getThemeConfig(themeId);
  await prisma.shop.update({ where: { id: shopId }, data: { themeId, ...defaults } });
}

export async function updateShop(
  shopId: string,
  data: { name: string; description?: string; currency: string; logo?: string; metaPixelId?: string; ga4MeasurementId?: string; googleAdsId?: string; googleAdsConversionLabel?: string },
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
      metaPixelId: data.metaPixelId || null,
      ga4MeasurementId: data.ga4MeasurementId || null,
      googleAdsId: data.googleAdsId || null,
      googleAdsConversionLabel: data.googleAdsConversionLabel || null,
    },
  });

  return ok(shop);
}

async function vercelDomainsRequest(
  method: string,
  path: string,
  body?: unknown,
) {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) return null;

  const url = `https://api.vercel.com/v10/projects/${projectId}/domains${path}${teamId ? `?teamId=${teamId}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok && res.status !== 404) return null;
  return res;
}

export async function connectCustomDomain(shopId: string, domain: string) {
  const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!cleaned || !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(cleaned))
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Invalid domain format", status: 400 });

  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shopData = await prisma.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
  if (!isProShop(shopData?.subscriptionPaidUntil)) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Custom domains require a Pro subscription. Upgrade to connect your domain.", status: 403 });
  }

  const existing = await prisma.shop.findFirst({ where: { customDomain: cleaned, NOT: { id: shopId } } });
  if (existing) return err({ code: ErrorCode.GENERAL_ERROR, message: "Domain already in use", status: 400 });

  await vercelDomainsRequest("POST", "", { name: cleaned });

  await prisma.shop.update({ where: { id: shopId }, data: { customDomain: cleaned, domainVerified: false } });

  return ok({ domain: cleaned, cname: "cname.vercel-dns.com" });
}

export async function removeCustomDomain(shopId: string) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { customDomain: true } });
  if (shop?.customDomain) {
    await vercelDomainsRequest("DELETE", `/${encodeURIComponent(shop.customDomain)}`);
  }

  await prisma.shop.update({ where: { id: shopId }, data: { customDomain: null, domainVerified: false } });
  return ok(null);
}

export async function checkDomainVerification(shopId: string) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { customDomain: true, domainVerified: true } });
  if (!shop?.customDomain) return err({ code: ErrorCode.GENERAL_ERROR, message: "No custom domain", status: 400 });

  const res = await vercelDomainsRequest("GET", `/${encodeURIComponent(shop.customDomain)}`);

  let verified = shop.domainVerified;
  if (res?.ok) {
    const data = await res.json() as { verified?: boolean };
    verified = data.verified === true;
    if (verified && !shop.domainVerified) {
      await prisma.shop.update({ where: { id: shopId }, data: { domainVerified: true } });
    }
  }

  return ok({ domain: shop.customDomain, verified });
}

export const createShop = async (name: string, slug: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  if (!name || !slug) return;

  const existing = await prisma.shop.findFirst({ where: { ownerId: session.user.id } });
  if (existing) return err({ code: ErrorCode.SHOP_CREATE_FAILED, message: "You already have a shop.", status: 400 });

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
