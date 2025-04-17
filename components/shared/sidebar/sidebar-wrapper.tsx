import { FC, ReactNode } from "react";
import { cn } from "@/lib";

interface SidebarWrapperProps {
  className?: string;
  children?: ReactNode;
}

export const SidebarWrapper: FC<SidebarWrapperProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        className,
        "flex h-full w-full flex-col gap-4 p-4 lg:flex-row",
      )}
    >
      <main className="flex h-[calc(100%-80px)] w-full gap-4 lg:h-full">
        {children}
      </main>
    </div>
  );
};
