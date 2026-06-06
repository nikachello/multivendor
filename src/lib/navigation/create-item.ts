import { NavItem } from "../types/sections";

export function createItem(type: "link" | "group"): NavItem {
  const id = crypto.randomUUID();

  if (type === "group") {
    return {
      id,
      type: "group",
      label: "ახალი კატეგორია",
      children: [],
    };
  }

  return {
    id,
    type: "link",
    label: "ახალი ლინკი",
    href: "/",
  };
}
