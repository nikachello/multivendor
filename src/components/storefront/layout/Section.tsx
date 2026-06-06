import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
};

const Section = ({ children, className, container = true }: Props) => {
  return (
    <section className={cn("w-full", className)}>
      {container ? (
        <div className="max-w-7xl mx-auto px-5 md:px-10">{children}</div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;
