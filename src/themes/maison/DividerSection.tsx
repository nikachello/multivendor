import { DividerSectionProps } from "@/lib/types/sections";

const spacing = { sm: "py-8", md: "py-16", lg: "py-24" };

const DividerSection = ({ spacing: s = "md" }: DividerSectionProps) => {
  return (
    <div className={`${spacing[s]} px-5 md:px-10`}>
      <div className="border-t border-[#E2DDD5]" />
    </div>
  );
};

export default DividerSection;
