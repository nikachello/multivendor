import type { Metadata } from "next";
import { getShop } from "@/lib/auth/get-shop";
import { getAnalyticsData } from "@/lib/db/queries";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.analytics.title };
}
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

  const [shop, d] = await Promise.all([getShop(), getDict()]);
  const data = await getAnalyticsData(shop.id, days);
  const t = d.dashboard.analytics;

  const topCards = [
    { label: t.sessions.replace("{days}", String(days)), value: data.sessionCount.toLocaleString() },
    { label: t.conversion, value: pct(data.conversionRate), note: t.conversion_note },
    { label: t.revenue.replace("{days}", String(days)), value: money(data.revenue, shop.currency) },
    { label: t.avg_order, value: data.orderCount > 0 ? money(data.aov, shop.currency) : "—" },
  ];

  const funnelSteps = [
    { label: t.funnel_sessions, value: data.sessionCount, pct: null },
    { label: t.funnel_atc, value: null, pct: data.atcRate, note: t.funnel_of_sessions },
    { label: t.funnel_checkout, value: null, pct: data.checkoutRate, note: t.funnel_of_atc },
    { label: t.funnel_purchase, value: null, pct: data.conversionRate, note: t.funnel_of_sessions },
  ];

  const hasData = data.sessionCount > 0 || data.orderCount > 0;

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{t.subtitle.replace("{days}", String(days)).replace("{name}", shop.name)}</p>
        </div>
        <DateRangePicker current={days} />
      </div>

      {!hasData && (
        <div className="border border-dashed border-gray-200 rounded-lg py-14 text-center">
          <p className="text-sm font-medium text-gray-500">{t.no_data}</p>
          <p className="text-xs text-gray-400 mt-1">{t.no_data_desc}</p>
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
          {t.funnel}
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
          {t.daily_revenue.replace("{days}", String(days))}
        </p>
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <RevenueChart data={data.dailyRevenue} currency={shop.currency} />
        </div>
      </div>

      {/* Top products */}
      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-4">
          {t.top_products}
        </p>
        {data.topProducts.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-10 text-center">
            <p className="text-sm text-gray-400">{t.no_sales}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t.col_product}</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">{t.col_orders}</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">{t.col_revenue}</th>
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
