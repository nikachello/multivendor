export default function NavigationLoading() {
  return (
    <div className="min-h-screen bg-white font-mono animate-pulse">
      {/* Top bar */}
      <header className="border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
        <div className="h-4 w-40 bg-gray-100 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 bg-gray-100 rounded" />
          <div className="h-7 w-12 bg-gray-100 rounded" />
        </div>
      </header>

      <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-57px)]">
        {/* Tree panel */}
        <aside className="border-r border-zinc-200 flex flex-col">
          <div className="flex border-b border-zinc-200">
            <div className="flex-1 h-10 bg-gray-50 border-r border-zinc-200" />
            <div className="flex-1 h-10 bg-gray-50" />
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-2">
                <div className="h-3 w-3 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded" style={{ width: `${50 + (i * 13) % 40}%` }} />
              </div>
            ))}
          </div>
        </aside>

        {/* Editor panel */}
        <div className="p-8 flex flex-col gap-6">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-10 bg-gray-100 rounded" />
              <div className="h-9 w-full bg-gray-100 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-10 bg-gray-100 rounded" />
              <div className="h-9 w-full bg-gray-100 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-10 bg-gray-100 rounded" />
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-100 rounded" />
                <div className="h-9 w-24 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
