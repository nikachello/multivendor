import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const type = typeof body.type === "string" ? body.type : "unknown";
    logger.error(`client.${type}`, {
      route: typeof body.route === "string" ? body.route : undefined,
      userId: typeof body.userId === "string" ? body.userId : undefined,
      shopId: typeof body.shopId === "string" ? body.shopId : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
      stack: typeof body.stack === "string" ? body.stack : undefined,
    });
  } catch {
    // always 200 — logging must never surface errors to the browser
  }
  return NextResponse.json({ ok: true });
}
