import { NavItem } from "../types/sections";

export function containsId(
  items: NavItem[],
  ancestorId: string,
  descendantId: string
): boolean {
  for (const item of items) {
    if (item.id === ancestorId) {
      return item.type === "group"
        ? hasDescendant(item.children, descendantId)
        : false;
    }
    if (item.type === "group") {
      if (containsId(item.children, ancestorId, descendantId)) return true;
    }
  }
  return false;
}

function hasDescendant(items: NavItem[], id: string): boolean {
  for (const item of items) {
    if (item.id === id) return true;
    if (item.type === "group" && hasDescendant(item.children, id)) return true;
  }
  return false;
}
