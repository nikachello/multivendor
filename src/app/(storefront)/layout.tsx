import Announcement from "@/components/storefront/Announcement";
import Navbar from "@/components/storefront/Navbar";
import Banner from "@/components/storefront/Banner";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Announcement />

      <Navbar />

      <Banner
        title="Welcome to the Store"
        subtitle="Discover curated products made for you"
        image="/banner.jpg"
        buttonText="Shop Now"
        href="/shop"
      />

      <main>{children}</main>
    </div>
  );
}
