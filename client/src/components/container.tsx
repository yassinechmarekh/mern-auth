import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

const Container = ({ className, children }: ContainerProps) => {
  return (
    <div
      className={cn(
        "container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
