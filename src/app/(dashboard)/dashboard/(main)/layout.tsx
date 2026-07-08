import type { Metadata } from "next";
import { getShop } from "@/lib/auth/get-shop";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const shop = await getShop();
  return {
    title: {
      template: `%s | ${shop.name}`,
      default: shop.name,
    },
  };
}

type BannerStrings = {
  expired: string;
  expiring_one: string;
  expiring_many: string;
};

function getSubscriptionBanner(
  paidUntil: Date | null,
  strings: BannerStrings,
): { message: string; style: string } | null {
  if (!paidUntil) return null;

  const now = new Date();
  const until = new Date(paidUntil);

  if (until < now) {
    return {
      message: strings.expired,
      style: "bg-amber-50 border-amber-200 text-amber-700",
    };
  }

  const daysLeft = Math.ceil((until.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 7) {
    const tmpl = daysLeft === 1 ? strings.expiring_one : strings.expiring_many;
    return {
      message: tmpl.replace("{days}", String(daysLeft)),
      style: "bg-amber-50 border-amber-200 text-amber-700",
    };
  }

  return null;
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const shop = await getShop();
  const d = await getDict();
  const bannerStrings = d.dashboard.subscription_banner;
  const banner = getSubscriptionBanner(shop.subscriptionPaidUntil, bannerStrings);

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
              {d.dashboard.subscription_banner.renew}
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
