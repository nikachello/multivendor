"use client";

type DataPoint = { date: string; value: number };

type Props = {
  data: DataPoint[];
  currency: string;
};

export default function RevenueChart({ data, currency }: Props) {
  const W = 800;
  const H = 180;
  const PAD = { top: 12, right: 12, bottom: 28, left: 56 };

  const max = Math.max(...data.map((d) => d.value), 1);
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  function x(i: number) {
    return PAD.left + (i / (data.length - 1)) * chartW;
  }
  function y(v: number) {
    return PAD.top + chartH - (v / max) * chartH;
  }

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`)
    .join(" ");

  const fillPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: max * t,
    y: y(max * t),
  }));

  // X-axis labels — show every 7th day
  const xLabels = data.filter((_, i) => i % 7 === 0 || i === data.length - 1);

  // Tooltip state via title element — pure SVG, no JS needed
  const hasRevenue = data.some((d) => d.value > 0);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 320, height: "auto" }}
      >
        <defs>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111827" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t) => (
          <g key={t.value}>
            <line
              x1={PAD.left} y1={t.y}
              x2={W - PAD.right} y2={t.y}
              stroke="#f3f4f6" strokeWidth="1"
            />
            <text
              x={PAD.left - 8} y={t.y + 4}
              textAnchor="end" fontSize="10" fill="#9ca3af"
            >
              {t.value === 0 ? "0" : t.value >= 1000
                ? `${(t.value / 1000).toFixed(1)}k`
                : t.value.toFixed(0)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((d) => {
          const i = data.indexOf(d);
          const label = new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return (
            <text key={d.date} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">
              {label}
            </text>
          );
        })}

        {/* Fill */}
        {hasRevenue && <path d={fillPath} fill="url(#fillGrad)" />}

        {/* Line */}
        {hasRevenue && (
          <path d={linePath} fill="none" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* Data point dots with tooltips */}
        {data.map((d, i) => (
          d.value > 0 && (
            <g key={d.date}>
              <circle cx={x(i)} cy={y(d.value)} r="3" fill="#111827" />
              <title>{`${d.date}: ${currency} ${d.value.toFixed(2)}`}</title>
            </g>
          )
        ))}

        {!hasRevenue && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="13" fill="#d1d5db">
            No revenue yet
          </text>
        )}
      </svg>
    </div>
  );
}
