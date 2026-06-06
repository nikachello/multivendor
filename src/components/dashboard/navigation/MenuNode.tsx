import { NavItem } from "@/lib/types/sections";

type Props = {
  item: NavItem;
  level?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function MenuNode({
  item,
  level = 0,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div>
      <div
        onClick={() => onSelect(item.id)}
        className={`cursor-pointer py-2 px-2 ${
          selectedId === item.id ? "bg-black text-white" : ""
        }`}
        style={{
          paddingLeft: `${level * 20}px`,
        }}
      >
        {item.label}
      </div>

      {item.type === "group" &&
        item.children.map((child) => (
          <MenuNode
            key={child.id}
            item={child}
            level={level + 1}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
