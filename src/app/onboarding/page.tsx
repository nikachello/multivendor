import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getShopByOwnerId } from "@/lib/db/queries";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const result = await getShopByOwnerId(session.user.id);
  if (result.ok) redirect("/dashboard");

  return <OnboardingForm />;
}
