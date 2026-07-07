import type { Metadata } from "next";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.auth.register.tab_title };
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
