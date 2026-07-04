export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-10 max-w-4xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="h-6 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col gap-2">
            <div className="h-7 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Funnel section */}
      <div className="flex flex-col gap-4">
        <div className="h-3 w-32 bg-gray-100 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col gap-2">
              <div className="h-7 w-16 bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-3 w-14 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Revenue chart */}
      <div className="flex flex-col gap-4">
        <div className="h-3 w-40 bg-gray-100 rounded" />
        <div className="bg-white border border-gray-100 rounded-lg p-6 h-56 flex flex-col justify-end gap-2">
          <div className="flex items-end gap-2 h-32">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-100 rounded-sm"
                style={{ height: `${30 + ((i * 17) % 60)}%` }}
              />
            ))}
          </div>
          <div className="h-3 w-full bg-gray-50 rounded" />
        </div>
      </div>

      {/* Top products table */}
      <div className="flex flex-col gap-4">
        <div className="h-3 w-36 bg-gray-100 rounded" />
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 h-10" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
              <div className="h-4 flex-1 bg-gray-100 rounded" />
              <div className="h-4 w-12 bg-gray-100 rounded" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
