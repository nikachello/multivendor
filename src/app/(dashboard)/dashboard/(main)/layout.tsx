import { getShop } from "@/lib/auth/get-shop";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const shop = await getShop();

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar shopName={shop.name} shopSlug={shop.slug} />
      <div className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
