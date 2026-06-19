import { headers } from "next/headers";
import { auth } from ".";
import { redirect } from "next/navigation";
import { getShopByOwnerId } from "../db/queries";

export const getShop = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return redirect("/login");

  const result = await getShopByOwnerId(session.user.id);
  if (!result.ok) redirect("/onboarding");

  return result.data;
};
