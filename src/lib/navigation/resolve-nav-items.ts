import { NavItem } from "../types/sections";

function resolveHref(href: string, shopSlug: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return `/shop/${shopSlug}`;
  return `/shop/${shopSlug}${href}`;
}

export function resolveNavItems(items: NavItem[], shopSlug: string): NavItem[] {
  return items.map((item) => {
    if (item.type === "link") {
      return { ...item, href: resolveHref(item.href, shopSlug) };
    }
    return { ...item, children: resolveNavItems(item.children, shopSlug) };
  });
}
