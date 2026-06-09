import { NavItem } from "../types/sections";

export function addItem(
  items: NavItem[],
  newItem: NavItem,
  parentId?: string
): NavItem[] {
  if (!parentId) {
    return [...items, newItem];
  }

  return items.map((item) => {
    if (item.id === parentId) {
      if (item.type !== "group") {
        throw new Error(
          `addItem: "${parentId}" is a link — cannot add children to a link.`
        );
      }
      return { ...item, children: [...item.children, newItem] };
    }
    if (item.type === "group") {
      return { ...item, children: addItem(item.children, newItem, parentId) };
    }
    return item;
  });
}
