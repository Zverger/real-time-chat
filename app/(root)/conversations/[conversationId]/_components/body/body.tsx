"use client";
import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";

import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "./message";

interface BodyProps extends PropsWithChildren {
  className?: string;
  conversationId: Id<"conversations">;
}

export const Body: FC<BodyProps> = ({ className, conversationId }) => {
  const {
    data: messages,
    status,
    error,
  } = useQuery(api.messages.getAll, { conversationId });
  return (
    <div
      className={cn(
        "no-scrollbar flex w-full flex-1 flex-col-reverse gap-2 overflow-y-scroll p-3",
        className,
      )}
    >
      {messages?.map(({ message, sender, isCurrentUser }, index) => {
        const lastByUser = messages[index - 1]?.sender.id === sender.id;
        return (
          <Message
            key={message.id}
            fromCurrentUser={isCurrentUser}
            senderImage={sender.imageUrl}
            lastByUser={lastByUser}
            content={message.content}
            createdAt={message.createdAt}
            type={message.type}
            senderName={sender.username}
          />
        );
      })}
    </div>
  );
};
