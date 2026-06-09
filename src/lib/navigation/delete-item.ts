import { NavItem } from "../types/sections";

export function deleteItem(items: NavItem[], id: string): NavItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.type === "group") {
        return { ...item, children: deleteItem(item.children, id) };
      }
      return item;
    });
}
