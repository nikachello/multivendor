import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderStatus } from "@/generated/prisma/client";
import { adminUpdateOrderStatus } from "@/lib/actions/admin";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  refunded: "bg-red-50 text-red-500",
};

const ALL_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
];

type ShippingAddress = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await assertAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      shop: { select: { name: true, slug: true, currency: true, id: true } },
      items: {
        include: {
          variant: {
            include: {
              product: { select: { name: true } },
              optionValues: {
                include: { optionValue: { include: { optionType: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const shipping = order.shippingAddress as ShippingAddress | null;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900 font-mono">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            {order.shop.name} ·{" "}
            {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(order.createdAt))}
          </p>
        </div>
        <Link
          href={`/admin/shops/${order.shop.id}`}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          View shop
        </Link>
      </div>

      {/* Status change */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Change Status</p>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <form key={s} action={async () => {
              "use server";
              await adminUpdateOrderStatus(order.id, s);
            }}>
              <button
                type="submit"
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all ${
                  order.status === s
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Customer</p>
          <p className="text-sm font-medium text-gray-900">{order.customerEmail ?? "—"}</p>
          {order.customerPhone && <p className="text-xs text-gray-400 mt-0.5">{order.customerPhone}</p>}
        </div>
        {shipping && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Shipping Address</p>
            <p className="text-sm text-gray-700">{shipping.name}</p>
            <p className="text-xs text-gray-400">{shipping.line1}</p>
            {shipping.line2 && <p className="text-xs text-gray-400">{shipping.line2}</p>}
            <p className="text-xs text-gray-400">{shipping.city} {shipping.postalCode}</p>
            <p className="text-xs text-gray-400">{shipping.country}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Items</p>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Variant</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const options = item.variant.optionValues
                  .map((ov) => `${ov.optionValue.optionType.name}: ${ov.optionValue.value}`)
                  .join(", ");
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{item.variant.product.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{options || "Default"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-900 text-right">${Number(item.price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-gray-100 px-4 py-3 flex flex-col items-end gap-1">
            {order.discount && Number(order.discount) > 0 && (
              <p className="text-xs text-gray-400">
                Discount: <span className="text-red-600">-${Number(order.discount).toFixed(2)}</span>
              </p>
            )}
            <p className="text-sm font-semibold text-gray-900">
              Total: ${Number(order.total).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
