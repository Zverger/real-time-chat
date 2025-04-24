"use client";

import { FC } from "react";
import { cn } from "@/lib";

interface DateProps {
  className?: string;
  date: string | null;
  display: boolean;
}

export const Date: FC<DateProps> = ({ className, date, display }) => {
  if (!date || !display) return null;

  return (
    <div
      className={cn("sticky top-0 flex items-center justify-center", className)}
    >
      <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 text-center">
        {date}
      </div>
    </div>
  );
};
