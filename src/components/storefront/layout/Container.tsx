import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: Props) => {
  return (
    <div className={cn("max-w-7xl mx-auto w-full px-5 md:px-10", className)}>
      {children}
    </div>
  );
};

export default Container;
