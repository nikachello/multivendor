export default function ThemesLoading() {
  return (
    <div className="p-8 max-w-4xl animate-pulse">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="h-6 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-72 bg-gray-100 rounded" />
      </div>

      {/* Theme cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border-2 border-gray-100 overflow-hidden">
            {/* Preview area */}
            <div className="w-full aspect-video bg-gray-100" />
            {/* Info + actions */}
            <div className="p-4 bg-white flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
              </div>
              <div className="h-7 w-20 bg-gray-100 rounded shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
