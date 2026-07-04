export default function TestimonialsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="h-6 w-28 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-36 bg-gray-100 rounded-md" />
      </div>

      {/* Testimonials table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 h-10" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
            {/* Name + position */}
            <div className="flex flex-col gap-1 w-32">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
            {/* Testimony */}
            <div className="flex flex-col gap-1 flex-1 max-w-xs">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded" />
            </div>
            {/* Rating */}
            <div className="h-4 w-20 bg-gray-100 rounded" />
            {/* Product */}
            <div className="h-5 w-20 bg-gray-100 rounded" />
            {/* Active toggle */}
            <div className="h-5 w-9 bg-gray-100 rounded-full" />
            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <div className="h-6 w-10 bg-gray-100 rounded" />
              <div className="h-6 w-14 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
