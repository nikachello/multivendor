export default function ProductEditLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-3 bg-gray-100 rounded" />
        <div className="h-4 w-28 bg-gray-100 rounded" />
      </div>

      {/* Product name heading */}
      <div className="h-8 w-56 bg-gray-100 rounded" />

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 gap-1">
        {["Details", "Images", "Options", "Variants"].map((tab) => (
          <div key={tab} className="h-9 w-20 bg-gray-100 rounded-t" />
        ))}
      </div>

      {/* Details tab panel skeleton (always show details as default) */}
      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Name + slug */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-12 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-10 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-24 w-full bg-gray-100 rounded" />
        </div>

        {/* Price + compare price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-10 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-28 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
        </div>

        {/* Category + status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-12 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
          </div>
        </div>

        {/* Save button */}
        <div className="h-9 w-28 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
