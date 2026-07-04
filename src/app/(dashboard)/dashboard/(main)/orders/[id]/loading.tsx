export default function OrderDetailLoading() {
  return (
    <div className="max-w-3xl flex flex-col gap-8 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-6 w-48 bg-gray-100 rounded mt-1" />
          <div className="h-4 w-36 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-gray-100 rounded" />
      </div>

      {/* Customer card */}
      <section className="border border-gray-100 rounded-lg p-5">
        <div className="h-3 w-20 bg-gray-100 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-10 bg-gray-100 rounded" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-10 bg-gray-100 rounded" />
            <div className="h-4 w-28 bg-gray-100 rounded" />
          </div>
        </div>
      </section>

      {/* Shipping address card */}
      <section className="border border-gray-100 rounded-lg p-5">
        <div className="h-3 w-28 bg-gray-100 rounded mb-4" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
          <div className="h-4 w-36 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </section>

      {/* Items card */}
      <section className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <ul className="divide-y divide-gray-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex gap-4 px-5 py-4 items-center">
              <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded" />
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
              <div className="h-4 w-20 bg-gray-100 rounded" />
            </li>
          ))}
        </ul>
        {/* Total row */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-between">
          <div className="h-4 w-10 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </section>
    </div>
  );
}
