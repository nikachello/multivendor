import { NavItem } from "../types/sections";

export function addItem(
  items: NavItem[],
  newItem: NavItem,
  parentId?: string
): NavItem[] {
  if (!parentId) {
    return [...items, newItem];
  }

  let matched = false;

  const result = items.map((item) => {
    if (item.id === parentId) {
      if (item.type !== "group") {
        // Surface this as a clear dev error instead of silently failing
        throw new Error(
          `addItem: item "${parentId}" is a link, not a group. Cannot add children to a link.`
        );
      }
      matched = true;
      return {
        ...item,
        children: [...(item.children ?? []), newItem],
      };
    }

    if (item.type === "group" && item.children) {
      return {
        ...item,
        children: addItem(item.children, newItem, parentId),
      };
    }

    return item;
  });

  return result;
}
