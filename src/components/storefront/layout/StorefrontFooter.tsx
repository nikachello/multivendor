const StorefrontFooter = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="text-white text-sm font-semibold tracking-widest uppercase mb-3">
              Your Store
            </p>
            <p className="text-xs leading-relaxed">
              Curated products for the modern lifestyle.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Shop
            </p>
            <ul className="space-y-2 text-xs">
              {["New Arrivals", "Best Sellers", "Collections", "Sale"].map(
                (label) => (
                  <li key={label}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {label}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Info
            </p>
            <ul className="space-y-2 text-xs">
              {[
                "About",
                "Privacy Policy",
                "Terms of Service",
                "Contact",
              ].map((label) => (
                <li key={label}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Your Store. All rights reserved.</p>
          <p className="text-neutral-600">Powered by Multivendor</p>
        </div>
      </div>
    </footer>
  );
};

export default StorefrontFooter;
