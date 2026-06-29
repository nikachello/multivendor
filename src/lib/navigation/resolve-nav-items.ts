import { NavItem } from "../types/sections";

function resolveHref(href: string, shopBase: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return shopBase || "/";
  return `${shopBase}${href}`;
}

export function resolveNavItems(items: NavItem[], shopBase: string): NavItem[] {
  return items.map((item) => {
    if (item.type === "link") {
      return { ...item, href: resolveHref(item.href, shopBase) };
    }
    return {
      ...item,
      href: item.href ? resolveHref(item.href, shopBase) : undefined,
      children: resolveNavItems(item.children, shopBase),
    };
  });
}
