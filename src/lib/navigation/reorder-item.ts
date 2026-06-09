import { NavItem } from "../types/sections";
import { removeItem } from "./move-item";
import { containsId } from "./contains-id";

export type DropPosition = {
  relativeToId: string | null;
  parentId: string | null;
  placement: "before" | "after";
};

export function reorderItem(
  items: NavItem[],
  draggedId: string,
  position: DropPosition
): NavItem[] {
  // Dropping relative to itself would remove and fail to re-insert the item.
  if (position.relativeToId === draggedId) return items;
  // Dropping a group into its own descendant removes the group and loses it.
  if (
    position.parentId !== null &&
    (position.parentId === draggedId ||
      containsId(items, draggedId, position.parentId))
  ) {
    return items;
  }

  const { items: withoutDragged, extracted } = removeItem(items, draggedId);
  if (!extracted) return items;
  return insertAtPosition(withoutDragged, extracted, position);
}

function insertAtPosition(
  items: NavItem[],
  toInsert: NavItem,
  position: DropPosition
): NavItem[] {
  if (position.parentId === null) {
    return insertIntoList(items, toInsert, position);
  }

  return items.map((item) => {
    if (item.id === position.parentId && item.type === "group") {
      return {
        ...item,
        children: insertIntoList(item.children, toInsert, position),
      };
    }
    if (item.type === "group") {
      return {
        ...item,
        children: insertAtPosition(item.children, toInsert, position),
      };
    }
    return item;
  });
}

function insertIntoList(
  list: NavItem[],
  toInsert: NavItem,
  position: DropPosition
): NavItem[] {
  if (position.relativeToId === null) {
    return [...list, toInsert];
  }

  const result: NavItem[] = [];
  for (const item of list) {
    if (item.id === position.relativeToId) {
      if (position.placement === "before") {
        result.push(toInsert, item);
      } else {
        result.push(item, toInsert);
      }
    } else {
      result.push(item);
    }
  }
  return result;
}
