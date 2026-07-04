import { headers } from "next/headers";
import { auth } from ".";
import { redirect } from "next/navigation";

export async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}
