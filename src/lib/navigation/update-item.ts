import { NavItem } from "../types/sections";

export function updateItem(
  items: NavItem[],
  id: string,
  patch: Partial<NavItem>
): NavItem[] {
  return items.map((item) => {
    if (item.id === id) {
      // If the item is a group and the patch doesn't explicitly set children,
      // preserve existing children to prevent accidental wipes.
      if (item.type === "group" && !("children" in patch)) {
        return {
          ...item,
          ...patch,
          children: item.children,
        } as NavItem;
      }

      return {
        ...item,
        ...patch,
      } as NavItem;
    }

    if (item.type === "group" && item.children) {
      return {
        ...item,
        children: updateItem(item.children, id, patch),
      };
    }

    return item;
  });
}
