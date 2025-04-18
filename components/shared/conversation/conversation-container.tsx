import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";
import { Card } from "@/components/ui";

interface ConversationContainerProps extends PropsWithChildren {
  className?: string;
}

export const ConversationContainer: FC<ConversationContainerProps> = ({
  className,
  children,
}) => {
  return (
    <Card
      className={cn(
        "flex h-[calc(100svh-32px)] w-full flex-col gap-2 p-2 lg:h-full",
        className,
      )}
    >
      {children}
    </Card>
  );
};
