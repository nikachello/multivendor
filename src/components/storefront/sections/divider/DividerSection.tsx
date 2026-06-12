import { DividerSectionProps } from "@/lib/types/sections";

const spacingMap = {
  sm: "py-6",
  md: "py-12",
  lg: "py-20",
};

export default function DividerSection({ spacing = "md" }: DividerSectionProps) {
  return <div className={spacingMap[spacing]} aria-hidden />;
}
