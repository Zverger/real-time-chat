import { FC } from "react";
import { cn } from "@/lib";

interface IIcon {
  size: number;
}

interface IconProps {
  className?: string;
  icon: FC<IIcon>;
  size: number;
}

export const Icon: FC<IconProps> = ({ icon: Icon, size, className }) => {
  return (
    <div
      className={cn(
        "rounded-lg border-1 border-gray-200 p-2 hover:inset-shadow-sm",
        className,
      )}
    >
      <Icon size={size} />
    </div>
  );
};
