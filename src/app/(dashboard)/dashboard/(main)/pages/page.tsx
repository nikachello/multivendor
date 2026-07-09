import { getShop } from "@/lib/auth/get-shop";
import prisma from "@/lib/db/prisma";
import PagesManager from "./PagesManager";

export const metadata = { title: "Pages" };

export default async function PagesPage() {
  const shop = await getShop();

  const pages = await prisma.page.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, slug: true, title: true, content: true, isPublished: true },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Pages</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Create and manage pages for your store — legal policies, about pages, and more.
        </p>
      </div>

      <PagesManager shopId={shop.id} shopSlug={shop.slug} initialPages={pages} />
    </div>
  );
}
