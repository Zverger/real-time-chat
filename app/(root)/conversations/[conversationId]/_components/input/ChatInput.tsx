import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";
import { Card } from "@/components/ui";

interface ChatInputProps extends PropsWithChildren {
  className?: string;
}

export const ChatInput: FC<ChatInputProps> = ({ className, children }) => {
  return (
    <Card className={cn("relative w-full rounded-lg p-2", className)}>
      Chat Input
    </Card>
  );
};
