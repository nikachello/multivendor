import { NavItem } from "../types/sections";

type Result = {
  items: NavItem[];
  extracted?: NavItem;
};

export function removeItem(items: NavItem[], id: string): Result {
  let extracted: NavItem | undefined;

  const next = items
    .map((item) => {
      if (item.id === id) {
        extracted = item;
        return null;
      }

      if (item.type === "group") {
        const result = removeItem(item.children ?? [], id);

        if (result.extracted) {
          extracted = result.extracted;
        }

        return {
          ...item,
          children: result.items,
        };
      }

      return item;
    })
    .filter(Boolean) as NavItem[];

  return { items: next, extracted };
}

export function insertIntoGroup(
  items: NavItem[],
  groupId: string,
  itemToInsert: NavItem
): NavItem[] {
  return items.map((item) => {
    if (item.id === groupId && item.type === "group") {
      return {
        ...item,
        children: [...(item.children ?? []), itemToInsert],
      };
    }

    if (item.type === "group") {
      return {
        ...item,
        children: insertIntoGroup(item.children ?? [], groupId, itemToInsert),
      };
    }

    return item;
  });
}

export function moveItem(
  items: NavItem[],
  itemId: string,
  targetGroupId: string
): NavItem[] {
  const { items: withoutItem, extracted } = removeItem(items, itemId);

  if (!extracted) return items;

  return insertIntoGroup(withoutItem, targetGroupId, extracted);
}
