import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
        404
      </p>
      <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
        Page not found
      </h1>
      <p className="text-sm text-neutral-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
