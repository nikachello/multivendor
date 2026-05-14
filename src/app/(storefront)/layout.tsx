import Announcement from "@/components/storefront/Announcement";
import Navbar from "@/components/storefront/Navbar";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Announcement />

      {/* HERO SECTION */}
      <div className="relative h-[600px] bg-[url('/banner.jpg')] bg-cover bg-center">
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* NAVBAR ON TOP */}
        <Navbar />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-5">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Welcome to the Store
          </h1>

          <p className="mt-3 text-sm md:text-base text-white/80">
            Discover curated products made for you
          </p>

          <button className="mt-6 px-6 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-5 md:px-10 py-10">{children}</main>
    </div>
  );
}
