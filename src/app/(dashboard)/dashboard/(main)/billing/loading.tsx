export default function BillingLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="h-6 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>

      {/* Card */}
      <div className="border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-28 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>

        {/* Expiry line */}
        <div className="h-3 w-48 bg-gray-100 rounded" />

        <div className="border-t border-gray-100" />

        {/* Action button */}
        <div className="h-9 w-36 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
