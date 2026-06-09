import { NavItem } from "../types/sections";

export function createItem(type: "link" | "group"): NavItem {
  const id = crypto.randomUUID();

  if (type === "group") {
    return { id, type: "group", label: "New group", children: [] };
  }

  return { id, type: "link", label: "New link", href: "/" };
}
