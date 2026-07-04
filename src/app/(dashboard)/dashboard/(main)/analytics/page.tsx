import { getShop } from "@/lib/auth/get-shop";
import { getAnalyticsData } from "@/lib/db/queries";
import RevenueChart from "./RevenueChart";
import DateRangePicker from "./DateRangePicker";

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function money(n: number, currency: string) {
  return `${currency} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const daysRaw = Number(sp.days);
  const days = [7, 30, 90].includes(daysRaw) ? daysRaw : 30;

  const shop = await getShop();
  const data = await getAnalyticsData(shop.id, days);

  const topCards = [
    { label: `Sessions (${days}d)`, value: data.sessionCount.toLocaleString() },
    { label: "Conversion rate", value: pct(data.conversionRate), note: "sessions → purchase" },
    { label: `Revenue (${days}d)`, value: money(data.revenue, shop.currency) },
    { label: "Avg. order value", value: data.orderCount > 0 ? money(data.aov, shop.currency) : "—" },
  ];

  const funnelSteps = [
    { label: "Sessions", value: data.sessionCount, pct: null },
    { label: "Add to cart", value: null, pct: data.atcRate, note: "of sessions" },
    { label: "Checkout", value: null, pct: data.checkoutRate, note: "of ATC sessions" },
    { label: "Purchase", value: null, pct: data.conversionRate, note: "of sessions" },
  ];

  const hasData = data.sessionCount > 0 || data.orderCount > 0;

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Last {days} days · {shop.name}</p>
        </div>
        <DateRangePicker current={days} />
      </div>

      {!hasData && (
        <div className="border border-dashed border-gray-200 rounded-lg py-14 text-center">
          <p className="text-sm font-medium text-gray-500">No data yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Data appears once shoppers visit your storefront.
          </p>
        </div>
      )}

      {/* Top metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {topCards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 rounded-lg p-5">
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            {card.note && <p className="text-[11px] text-gray-300 mt-0.5">{card.note}</p>}
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-4">
          Conversion funnel
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {funnelSteps.map((step, i) => (
            <div key={step.label} className="bg-white border border-gray-100 rounded-lg p-5 relative">
              {i > 0 && (
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-gray-200 hidden sm:block">›</span>
              )}
              <p className="text-2xl font-semibold text-gray-900">
                {step.pct !== null ? pct(step.pct) : step.value?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">{step.label}</p>
              {step.note && <p className="text-[11px] text-gray-300 mt-0.5">{step.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Revenue chart */}
      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-4">
          Daily revenue — last {days} days
        </p>
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <RevenueChart data={data.dailyRevenue} currency={shop.currency} />
        </div>
      </div>

      {/* Top products */}
      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-4">
          Top products by revenue
        </p>
        {data.topProducts.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-10 text-center">
            <p className="text-sm text-gray-400">No sales yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Orders</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.topProducts.map((p) => (
                  <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-800 text-sm">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm text-right">{p.orders}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-right">{money(p.revenue, shop.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
