export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="h-6 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-56 bg-gray-100 rounded" />
      </div>

      {/* General section */}
      <section className="flex flex-col gap-4">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-10 w-full bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-28 bg-gray-100 rounded" />
          <div className="h-10 w-full bg-gray-100 rounded" />
          <div className="h-3 w-48 bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-20 w-full bg-gray-100 rounded" />
        </div>
      </section>

      {/* Commerce section */}
      <section className="flex flex-col gap-4">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-18 bg-gray-100 rounded" />
          <div className="h-10 w-full bg-gray-100 rounded" />
        </div>
      </section>

      {/* Branding section */}
      <section className="flex flex-col gap-4">
        <div className="h-3 w-18 bg-gray-100 rounded" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-12 bg-gray-100 rounded" />
          <div className="h-16 w-32 bg-gray-100 rounded" />
        </div>
      </section>

      {/* Tracking section */}
      <section className="flex flex-col gap-4">
        <div className="h-3 w-36 bg-gray-100 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
          </div>
        ))}
      </section>

      {/* Save button */}
      <div className="h-9 w-28 bg-gray-100 rounded" />
    </div>
  );
}
