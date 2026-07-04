import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getShop } from "@/lib/auth/get-shop";
import { getOrderById } from "@/lib/db/queries";
import OrderStatusSelect from "./OrderStatusSelect";
import CopyButton from "./CopyButton";

type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [shop, orderResult] = await Promise.all([getShop(), getOrderById(id)]);

  if (!orderResult.ok) notFound();
  const order = orderResult.data;

  if (order.shopId !== shop.id) notFound();

  const address = order.shippingAddress as ShippingAddress;

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Orders
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-2 flex items-center">
            Order <span className="font-mono text-gray-400 ml-1.5">#{order.id.slice(-8).toUpperCase()}</span>
            <CopyButton text={order.id} />
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} shopId={shop.id} />
      </div>

      {/* Customer */}
      <section className="border border-gray-100 rounded-lg p-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Customer</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Email</p>
            <p className="text-gray-900">{order.customerEmail ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Phone</p>
            <p className="text-gray-900">{order.customerPhone ?? "—"}</p>
          </div>
        </div>
      </section>

      {/* Shipping address */}
      <section className="border border-gray-100 rounded-lg p-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Shipping address</h2>
        <div className="text-sm text-gray-600 space-y-0.5">
          <p className="font-medium text-gray-900">{address.name}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>{[address.city, address.postalCode].filter(Boolean).join(", ")}</p>
          <p>{address.country}</p>
        </div>
      </section>

      {/* Delivery note */}
      {order.notes && (
        <section className="border border-gray-100 rounded-lg p-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Delivery note</h2>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </section>
      )}

      {/* Items */}
      <section className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            Items ({order.items.length})
          </h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 px-5 py-4">
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
                {item.image ? (
                  <Image src={item.image} alt={item.productName} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                {Object.values(item.variantOptions as Record<string, string>).length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {Object.values(item.variantOptions as Record<string, string>).join(" · ")}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {shop.currency} {(Number(item.price) * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <div className="px-5 py-4 border-t border-gray-100 flex justify-between text-sm">
          <span className="text-gray-400">Total</span>
          <span className="font-semibold text-gray-900">{shop.currency} {Number(order.total).toFixed(2)}</span>
        </div>
      </section>
    </div>
  );
}
