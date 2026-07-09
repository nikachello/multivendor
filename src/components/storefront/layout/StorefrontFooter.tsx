import Link from "next/link";
import { NavItem } from "@/lib/types/sections";

type Props = {
  shopName: string;
  shopBase: string;
  footerItems?: NavItem[];
};

function resolveHref(href: string, shopBase: string) {
  if (href.startsWith("http")) return href;
  return `${shopBase}${href === "/" ? "" : href}`;
}

function renderItem(item: NavItem, shopBase: string) {
  if (item.type === "group") {
    return (
      <div key={item.id}>
        <p className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
          {item.label}
        </p>
        <ul className="space-y-2 text-xs">
          {item.children.map((child) => (
            <li key={child.id}>
              {child.type === "link" && (
                <Link
                  href={resolveHref(child.href, shopBase)}
                  className="hover:text-white transition-colors"
                  {...(child.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {child.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

const StorefrontFooter = ({ shopName, shopBase, footerItems = [] }: Props) => {
  const groups = footerItems.filter((i) => i.type === "group");
  const flatLinks = footerItems.filter((i) => i.type === "link") as Extract<NavItem, { type: "link" }>[];
  const hasCustom = footerItems.length > 0;

  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="text-white text-sm font-semibold tracking-widest uppercase mb-3">
              {shopName}
            </p>
          </div>

          {hasCustom ? (
            <>
              {/* Render groups as columns */}
              {groups.map((g) => renderItem(g, shopBase))}

              {/* Flat links get their own column if any */}
              {flatLinks.length > 0 && (
                <div>
                  <ul className="space-y-2 text-xs">
                    {flatLinks.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={resolveHref(item.href, shopBase)}
                          className="hover:text-white transition-colors"
                          {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Default fallback */}
              <div>
                <p className="text-white text-xs font-semibold tracking-widest uppercase mb-4">Shop</p>
                <ul className="space-y-2 text-xs">
                  <li><Link href={shopBase || "/"} className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href={`${shopBase}/collections`} className="hover:text-white transition-colors">Collections</Link></li>
                  <li><Link href={`${shopBase}/search`} className="hover:text-white transition-colors">Search</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-white text-xs font-semibold tracking-widest uppercase mb-4">Info</p>
                <ul className="space-y-2 text-xs">
                  <li><Link href={`${shopBase}/p/terms-and-conditions`} className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href={`${shopBase}/p/privacy-policy`} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} {shopName}. All rights reserved.</p>
          <p className="text-neutral-600">Powered by MultiStore</p>
        </div>
      </div>
    </footer>
  );
};

export default StorefrontFooter;
