import { NavItem } from "../types/sections";

/**
 * Returns true if the item with `ancestorId` contains `descendantId`
 * anywhere in its subtree. Used to clear selection when an ancestor is deleted.
 */
export function containsId(
  items: NavItem[],
  ancestorId: string,
  descendantId: string
): boolean {
  for (const item of items) {
    if (item.id === ancestorId) {
      // Found the ancestor — now check if descendantId is inside it
      return item.type === "group"
        ? hasDescendant(item.children ?? [], descendantId)
        : false;
    }

    if (item.type === "group") {
      if (containsId(item.children ?? [], ancestorId, descendantId)) {
        return true;
      }
    }
  }

  return false;
}

function hasDescendant(items: NavItem[], id: string): boolean {
  for (const item of items) {
    if (item.id === id) return true;
    if (item.type === "group" && hasDescendant(item.children ?? [], id)) {
      return true;
    }
  }
  return false;
}
