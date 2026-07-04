export default function CouponsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="h-6 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-56 bg-gray-100 rounded" />
      </div>

      {/* New coupon button */}
      <div className="flex justify-end">
        <div className="h-9 w-32 bg-gray-100 rounded" />
      </div>

      {/* Coupons table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 h-10" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
            {/* Code */}
            <div className="h-4 w-24 bg-gray-100 rounded" />
            {/* Discount */}
            <div className="h-4 w-28 bg-gray-100 rounded flex-1" />
            {/* Uses */}
            <div className="h-4 w-12 bg-gray-100 rounded" />
            {/* Expires */}
            <div className="h-4 w-20 bg-gray-100 rounded" />
            {/* Status */}
            <div className="h-5 w-16 bg-gray-100 rounded" />
            {/* Action */}
            <div className="h-4 w-4 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
