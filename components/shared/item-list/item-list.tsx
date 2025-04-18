"use client";
import { FC, PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib";
import { Card } from "@/components/ui";
import { useConversation } from "@/hooks/useConversation";

interface ItemListProps extends PropsWithChildren {
  className?: string;
  title: string;
  action?: ReactNode;
}

export const ItemList: FC<ItemListProps> = ({
  className,
  title,
  action: Action,
  children,
}) => {
  const { isActive } = useConversation();
  return (
    <Card
      className={cn("hidden h-full w-full p-2 lg:w-80 lg:flex-none", {
        block: !isActive,
        "lg:block": isActive,
      })}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {Action}
      </div>
      <div className="flex h-full w-full flex-col items-center justify-start gap-2">
        {children}
      </div>
    </Card>
  );
};
