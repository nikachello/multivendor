export default function ShippingLoading() {
  return (
    <div className="px-8 py-8 animate-pulse">
      <div className="max-w-xl space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <div className="h-6 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>

        {/* Default rate */}
        <section className="space-y-3">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-56 bg-gray-100 rounded" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-8 bg-gray-100 rounded" />
          </div>
        </section>

        {/* City rates */}
        <section className="space-y-3">
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="h-3 w-48 bg-gray-100 rounded" />
          <div className="border border-gray-100 rounded divide-y divide-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
                <div className="h-9 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 flex-1 bg-gray-100 rounded" />
            <div className="h-10 w-20 bg-gray-100 rounded" />
          </div>
        </section>

        {/* Free threshold */}
        <section className="space-y-3">
          <div className="h-3 w-40 bg-gray-100 rounded" />
          <div className="h-3 w-72 bg-gray-100 rounded" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-8 bg-gray-100 rounded" />
          </div>
        </section>

        {/* Save button */}
        <div className="h-10 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
