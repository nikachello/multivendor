import { headers } from "next/headers";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "multistore.ge";

export async function getShopBase(slug: string): Promise<string> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(":")[0];
  return host === `${slug}.${ROOT_DOMAIN}` ? "" : `/shop/${slug}`;
}
