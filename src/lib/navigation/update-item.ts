import { NavItem } from "../types/sections";

export function updateItem(
  items: NavItem[],
  id: string,
  patch:
    | { label?: string }
    | { label?: string; href?: string }
    | {
        label?: string;
        type?: "link" | "group";
        href?: string;
        children?: NavItem[];
      }
): NavItem[] {
  return items.map((item) => {
    if (item.id === id) {
      // link → group
      if ("type" in patch && patch.type === "group" && item.type === "link") {
        return {
          id: item.id,
          type: "group",
          label: patch.label ?? item.label,
          children: [],
        } satisfies NavItem;
      }

      // group → link
      if ("type" in patch && patch.type === "link" && item.type === "group") {
        return {
          id: item.id,
          type: "link",
          label: patch.label ?? item.label,
          href: "href" in patch ? patch.href ?? "/" : "/",
        } satisfies NavItem;
      }

      // Same-type patch
      if (item.type === "link") {
        return {
          ...item,
          ...("label" in patch && patch.label !== undefined
            ? { label: patch.label }
            : {}),
          ...("href" in patch && patch.href !== undefined
            ? { href: patch.href }
            : {}),
        } satisfies NavItem;
      }

      if (item.type === "group") {
        return {
          ...item,
          ...("label" in patch && patch.label !== undefined
            ? { label: patch.label }
            : {}),
          ...("children" in patch && patch.children !== undefined
            ? { children: patch.children }
            : {}),
        } satisfies NavItem;
      }
    }

    if (item.type === "group") {
      return { ...item, children: updateItem(item.children, id, patch) };
    }

    return item;
  });
}
