import { NavItem } from "../types/sections";

export function findItem(items: NavItem[], id: string): NavItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.type === "group") {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
