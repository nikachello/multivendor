// ProsContainer.tsx

import { Pro } from "@/lib/types/data-types";
import ProItem from "./ProItem";

type Props = {
  pros: Pro[];
};

const ProsContainer = ({ pros }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {pros.map((pro, id) => (
        <ProItem key={id} pro={pro} />
      ))}
    </div>
  );
};

export default ProsContainer;
