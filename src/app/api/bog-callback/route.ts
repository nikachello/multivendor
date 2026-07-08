import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { verifyBogCallback } from "@/lib/bog";
import prisma from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { sendOrderConfirmation } from "@/lib/email";

const SUBSCRIPTION_PRICE_GEL = 29;

function isUniqueConstraint(e: unknown): boolean {
  return (e as { code?: string })?.code === "P2002";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("Callback-Signature");

  if (!verifyBogCallback(rawBody, signature)) {
    logger.warn("api.bogCallback", { route: "/api/bog-callback", reason: "invalid_signature" });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event: string;
    body: {
      external_order_id: string;
      order_status: { key: string };
      purchase_units?: { currency_code?: string; transfer_amount?: number; request_amount?: number };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event !== "order_payment") return NextResponse.json({ ok: true });

  const { external_order_id, order_status, purchase_units } = payload.body;

  if (order_status.key !== "completed") return NextResponse.json({ ok: true });

  const paidAmount = purchase_units?.transfer_amount ?? purchase_units?.request_amount;
  const currency = purchase_units?.currency_code;
  if (currency !== undefined && currency !== "GEL")
    return NextResponse.json({ error: "Unexpected currency" }, { status: 400 });

  const bodyHash = createHash("sha256").update(rawBody).digest("hex");

  // ── Vendor order: ord_<orderId> ──────────────────────────────────────────
  if (external_order_id?.startsWith("ord_")) {
    const orderId = external_order_id.slice(4);

    // Fetch order and verify amount BEFORE burning the idempotency slot so that
    // bad-amount callbacks do not permanently prevent future retries.
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shop: { select: { name: true, currency: true, slug: true } },
        items: { select: { productName: true, variantOptions: true, quantity: true, price: true } },
      },
    });

    if (!order) {
      logger.warn("api.bogCallback", { route: "/api/bog-callback", reason: "order_not_found", orderId });
      return NextResponse.json({ ok: true });
    }

    if (paidAmount === undefined || paidAmount < Number(order.total) - 0.01) {
      logger.warn("api.bogCallback", { route: "/api/bog-callback", reason: "insufficient_payment", paidAmount, expected: Number(order.total), orderId });
      return NextResponse.json({ error: "Insufficient payment amount" }, { status: 400 });
    }

    // Atomically burn idempotency receipt + confirm order (only if still pending).
    // Using a transaction ensures that a DB failure on either step rolls back both,
    // so a retry can still succeed. updateMany with status filter avoids re-confirming
    // already-cancelled or refunded orders.
    let alreadyHandled = false;
    try {
      await prisma.$transaction(async (tx) => {
        await tx.bogCallbackReceipt.create({ data: { bodyHash, shopId: order.shopId } });
        const updated = await tx.order.updateMany({
          where: { id: orderId, status: "pending" },
          data: { status: "confirmed" },
        });
        if (updated.count === 0) alreadyHandled = true;
      });
    } catch (e: unknown) {
      if (isUniqueConstraint(e)) return NextResponse.json({ ok: true, replay: true });
      throw e;
    }

    if (alreadyHandled) return NextResponse.json({ ok: true });

    if (order.customerEmail) {
      const address = order.shippingAddress as { name?: string; line1?: string; city?: string };
      try {
        await sendOrderConfirmation({
          to: order.customerEmail,
          shopName: order.shop.name,
          orderId: order.id,
          customerName: address?.name ?? order.customerEmail,
          items: order.items.map((item) => ({
            productName: item.productName,
            variantOptions: Object.entries(item.variantOptions as Record<string, string>)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", "),
            quantity: item.quantity,
            price: Number(item.price),
          })),
          total: Number(order.total),
          currency: order.shop.currency,
          shippingAddress: {
            name: address?.name ?? "",
            line1: address?.line1 ?? "",
            city: address?.city ?? "",
            country: "Georgia",
          },
        });
      } catch { /* email failure must not fail the callback */ }
    }

    return NextResponse.json({ ok: true });
  }

  // ── Platform subscription: sub_<shopId> ──────────────────────────────────
  if (!external_order_id?.startsWith("sub_")) return NextResponse.json({ ok: true });

  if (paidAmount === undefined || paidAmount < SUBSCRIPTION_PRICE_GEL) {
    logger.warn("api.bogCallback", { route: "/api/bog-callback", reason: "insufficient_payment", paidAmount });
    return NextResponse.json({ error: "Insufficient payment amount" }, { status: 400 });
  }

  const shopId = external_order_id.slice(4);

  // Atomically burn receipt + extend subscription.
  // If the shop doesn't exist we still commit the receipt (stops BOG retries)
  // but skip the extension and log a warning.
  let shopNotFound = false;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.bogCallbackReceipt.create({ data: { bodyHash, shopId } });
      const shop = await tx.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
      if (!shop) { shopNotFound = true; return; }
      const base = shop.subscriptionPaidUntil && shop.subscriptionPaidUntil > new Date()
        ? new Date(shop.subscriptionPaidUntil)
        : new Date();
      const paidUntil = new Date(base);
      paidUntil.setDate(paidUntil.getDate() + 30);
      await tx.shop.update({ where: { id: shopId }, data: { subscriptionPaidUntil: paidUntil } });
    });
  } catch (e: unknown) {
    if (isUniqueConstraint(e)) return NextResponse.json({ ok: true, replay: true });
    throw e;
  }

  if (shopNotFound)
    logger.warn("api.bogCallback", { route: "/api/bog-callback", reason: "shop_not_found", shopId });

  return NextResponse.json({ ok: true });
}
