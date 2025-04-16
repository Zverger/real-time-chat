import { FC } from "react";
import { cn } from "@/lib";
import Image from "next/image";

interface LoadingLogoProps {
  className?: string;
  size?: number;
}

export const LoadingLogo: FC<LoadingLogoProps> = ({
  className,
  size = 100,
}) => {
  return (
    <div
      className={cn(
        className,
        "h-full w-full flex justify-center items-center "
      )}
    >
      <Image
        src="/logo.svg"
        alt="logo"
        width={size}
        height={size}
        className="coin-animation "
      />
    </div>
  );
};
