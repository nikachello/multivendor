export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side — branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12">
        <div className="text-xl font-bold">MultiStore</div>
        <blockquote className="space-y-2">
          <p className="text-lg text-zinc-300">
            "I launched my store in under 10 minutes. Sales came in the same
            day."
          </p>
          <footer className="text-zinc-500">— Niko, nikowatches.com</footer>
        </blockquote>
      </div>

      {/* Right side — form */}
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
