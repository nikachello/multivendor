export default function DashboardLoading() {
  return (
    <div className="max-w-4xl flex flex-col gap-10 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="h-7 w-40 bg-gray-100 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col gap-3">
            <div className="h-8 w-8 bg-gray-100 rounded-md" />
            <div className="h-7 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-14 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-12 bg-gray-100 rounded" />
        </div>
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 h-10" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-40 bg-gray-100 rounded flex-1" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
              <div className="h-5 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="flex flex-wrap gap-3">
          <div className="h-9 w-28 bg-gray-100 rounded-md" />
          <div className="h-9 w-32 bg-gray-100 rounded-md" />
          <div className="h-9 w-24 bg-gray-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}
