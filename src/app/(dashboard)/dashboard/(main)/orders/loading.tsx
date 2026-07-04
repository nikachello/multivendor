export default function OrdersLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col gap-1.5">
        <div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 flex-1 bg-gray-100 rounded animate-pulse" />
        <div className="h-9 w-36 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 h-10" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-100 rounded animate-pulse flex-1" />
            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
