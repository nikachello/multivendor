export default function NewCategoryLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-3 bg-gray-100 rounded" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>

      {/* Heading */}
      <div className="h-8 w-40 bg-gray-100 rounded" />

      {/* Form fields */}
      <div className="flex flex-col gap-6 max-w-xl">
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
          <div className="h-20 w-full bg-gray-100 rounded" />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-12 bg-gray-100 rounded" />
          <div className="h-16 w-32 bg-gray-100 rounded" />
        </div>

        {/* Status toggle */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-10 bg-gray-100 rounded-full" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>

        {/* Save button */}
        <div className="h-9 w-28 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
