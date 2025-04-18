import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";
import { Card } from "@/components/ui";

interface ConversationFallbackProps {
  className?: string;
}

export const ConversationFallback: FC<ConversationFallbackProps> = ({
  className,
}) => {
  return (
    <Card
      className={cn(
        "bg-secondary text-secondary-foreground hidden h-full w-full items-center justify-center p-2 lg:flex",
        className,
      )}
    >
      Select/start a conversation to get started!
    </Card>
  );
};
