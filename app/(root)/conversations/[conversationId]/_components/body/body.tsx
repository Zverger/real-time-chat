import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";

interface BodyProps extends PropsWithChildren {
  className?: string;
}

export const Body: FC<BodyProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "no-scrollbar flex w-full flex-1 flex-col-reverse gap-2 overflow-y-scroll p-3",
        className,
      )}
    >
      Chat body
    </div>
  );
};
