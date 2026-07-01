export default function CategoriesLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 bg-gray-100 rounded animate-pulse" />
        <div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="h-9 w-48 bg-gray-100 rounded animate-pulse" />
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-gray-50 h-10" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
            <div className="h-8 w-8 bg-gray-100 rounded animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
