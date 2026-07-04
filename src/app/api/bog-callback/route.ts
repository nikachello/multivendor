import { NextRequest, NextResponse } from "next/server";
import { verifyBogCallback } from "@/lib/bog";
import prisma from "@/lib/db/prisma";

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

  const { external_order_id, order_status } = payload.body;

  if (order_status.key !== "completed") {
    return NextResponse.json({ ok: true });
  }

  // external_order_id is "sub_<shopId>"
  if (!external_order_id?.startsWith("sub_")) {
    return NextResponse.json({ ok: true });
  }

  const shopId = external_order_id.slice(4);
  const paidUntil = new Date();
  paidUntil.setDate(paidUntil.getDate() + 30);

  await prisma.shop.update({
    where: { id: shopId },
    data: { subscriptionPaidUntil: paidUntil },
  });

  return NextResponse.json({ ok: true });
}
