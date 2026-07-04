"use server";

import { getShop } from "@/lib/auth/get-shop";
import { createBogOrder } from "@/lib/bog";
import { err, ok } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";

const SUBSCRIPTION_PRICE_GEL = 29;

export async function startSubscriptionPayment() {
  let shop;
  try {
    shop = await getShop();
  } catch {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Unauthorized", status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://multistore.ge";

  try {
    const { redirectUrl } = await createBogOrder({
      shopId: shop.id,
      amountGel: SUBSCRIPTION_PRICE_GEL,
      callbackUrl: `${baseUrl}/api/bog-callback`,
      successUrl: `${baseUrl}/dashboard/billing?status=success`,
      failUrl: `${baseUrl}/dashboard/billing?status=failed`,
    });

    return ok({ redirectUrl });
  } catch (e) {
    console.error("BOG order creation failed:", e);
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Payment initiation failed", status: 500 });
  }
}
