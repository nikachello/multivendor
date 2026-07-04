import { getShop } from "@/lib/auth/get-shop";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";

function getSubscriptionBanner(
  paidUntil: Date | null,
): { message: string; style: string } | null {
  if (!paidUntil) return null;

  const now = new Date();
  const until = new Date(paidUntil);

  if (until < now) {
    return {
      message: "Your Pro subscription has expired. You're back on the free plan — upgrade to restore all features.",
      style: "bg-amber-50 border-amber-200 text-amber-700",
    };
  }

  const daysLeft = Math.ceil((until.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 7) {
    return {
      message: `Your Pro subscription expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Renew to keep all Pro features.`,
      style: "bg-amber-50 border-amber-200 text-amber-700",
    };
  }

  return null;
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const shop = await getShop();
  const banner = getSubscriptionBanner(shop.subscriptionPaidUntil);

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar shopName={shop.name} shopSlug={shop.slug} />
      <div className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4 md:p-8">
        {banner && (
          <div className={`mb-6 flex items-center justify-between border rounded-lg px-4 py-3 text-[13px] ${banner.style}`}>
            <span>{banner.message}</span>
            <Link
              href="/dashboard/billing"
              className="ml-4 shrink-0 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Renew now
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
