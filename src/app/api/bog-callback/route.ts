import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { verifyBogCallback } from "@/lib/bog";
import prisma from "@/lib/db/prisma";

const SUBSCRIPTION_PRICE_GEL = 29;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("Callback-Signature");

  if (!verifyBogCallback(rawBody, signature)) {
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

  if (payload.event !== "order_payment") {
    return NextResponse.json({ ok: true });
  }

  const { external_order_id, order_status, purchase_units } = payload.body;

  if (order_status.key !== "completed") {
    return NextResponse.json({ ok: true });
  }

  // external_order_id is "sub_<shopId>"
  if (!external_order_id?.startsWith("sub_")) {
    return NextResponse.json({ ok: true });
  }

  // Reject amount/currency mismatches when BOG's payload includes them — a signed
  // "completed" callback should never grant Pro for less than the subscription price.
  const paidAmount = purchase_units?.transfer_amount ?? purchase_units?.request_amount;
  const currency = purchase_units?.currency_code;
  if (currency !== undefined && currency !== "GEL") {
    return NextResponse.json({ error: "Unexpected currency" }, { status: 400 });
  }
  if (paidAmount !== undefined && paidAmount < SUBSCRIPTION_PRICE_GEL) {
    return NextResponse.json({ error: "Amount below subscription price" }, { status: 400 });
  }

  const shopId = external_order_id.slice(4);

  // Idempotency: a signed callback is tied to this exact byte-for-byte body, so
  // hashing it gives a stable replay key without depending on BOG's internal
  // payment-id field naming. Reject a body we've already applied.
  const bodyHash = createHash("sha256").update(rawBody).digest("hex");
  try {
    await prisma.bogCallbackReceipt.create({ data: { bodyHash, shopId } });
  } catch {
    // Unique violation — this exact callback was already processed.
    return NextResponse.json({ ok: true, replay: true });
  }

  const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
  const base = shop?.subscriptionPaidUntil && shop.subscriptionPaidUntil > new Date()
    ? new Date(shop.subscriptionPaidUntil)
    : new Date();
  const paidUntil = new Date(base);
  paidUntil.setDate(paidUntil.getDate() + 30);

  await prisma.shop.update({
    where: { id: shopId },
    data: { subscriptionPaidUntil: paidUntil },
  });

  return NextResponse.json({ ok: true });
}
