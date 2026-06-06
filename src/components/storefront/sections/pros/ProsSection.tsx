import { ProsSectionProps } from "@/lib/types/sections";
import ProItem from "./ProItem";

const ProsSection = ({ pros }: ProsSectionProps) => {
  return (
    <section>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pt-20">
        {pros.map((pro, id) => (
          <ProItem key={id} pro={pro} />
        ))}
      </div>
    </section>
  );
};

export default ProsSection;
