import StorefrontFooter from "@/components/storefront/layout/StorefrontFooter";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
    </div>
  );
}
