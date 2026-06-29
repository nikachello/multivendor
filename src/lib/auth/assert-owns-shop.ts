import { headers } from "next/headers";
import { auth } from ".";
import prisma from "../db/prisma";

export async function assertOwnsShop(shopId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthenticated");
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: {
      ownerId: true,
    },
  });
  if (!shop || shop.ownerId !== session.user.id) throw new Error("Forbidden");
}
