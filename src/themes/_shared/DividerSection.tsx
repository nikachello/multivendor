import type { ThemeConfig } from "@/themes/types";
import type { DividerSectionProps } from "@/lib/types/sections";

type Props = DividerSectionProps & { themeConfig: ThemeConfig };

const spacingMap = { sm: "py-8", md: "py-16", lg: "py-24" };

const DividerSection = ({ spacing = "md", themeConfig }: Props) => {
  return (
    <div className={`${spacingMap[spacing]} ${themeConfig.layout.contentPx}`}>
      <div className={themeConfig.components.divider} />
    </div>
  );
};

export default DividerSection;
