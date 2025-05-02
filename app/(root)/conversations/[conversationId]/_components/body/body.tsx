"use client";
import { FC, PropsWithChildren, useEffect } from "react";
import { cn } from "@/lib";

import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "./message";
import { useMutationState } from "@/hooks";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui";

interface BodyProps extends PropsWithChildren {
  className?: string;
  conversationId: Id<"conversations">;
  members: {
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    [key: string]: unknown;
  }[];
}

export const Body: FC<BodyProps> = ({ className, conversationId, members }) => {
  const { data: messages } = useQuery(api.messages.getAll, { conversationId });

  const [markRead] = useMutationState(api.conversations.markRead);

  useEffect(() => {
    if (messages && messages.length) {
      markRead({
        conversationId,
        messageId: messages[0].message.id,
      });
    }
  }, [messages, conversationId, markRead]);

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className="text-muted-foreground text-right text-sm">{`Seen by ${names[0]}`}</p>
        );
      case 2:
        return (
          <p className="text-muted-foreground text-right text-sm">{`Seen by ${names[0]} and ${names[1]}`}</p>
        );
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-muted-foreground text-right text-sm">{`Seen by ${names[0]} , ${names[3]} and ${names.length - 2} more`}</p>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {names.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((user) => user.username?.split(" ")[0] || "Deleted user");
    if (seenUsers.length === 0) return null;
    return formatSeenBy(seenUsers);
  };

  return (
    <div
      className={cn(
        "no-scrollbar relative flex w-full flex-1 flex-col-reverse gap-2 overflow-y-scroll p-3",
        className,
      )}
    >
      {messages?.map(({ message, sender, isCurrentUser }, index) => {
        const lastByUser = messages[index - 1]?.sender.id === sender.id;
        const firtsByDay =
          new Date(message.createdAt).getDate() !==
          new Date(messages[index + 1]?.message.createdAt).getDate();

        const seenMessage = isCurrentUser ? getSeenMessage(message.id) : null;
        return (
          <Message
            zIndex={messages.length - index}
            key={message.id}
            firstByDay={firtsByDay}
            fromCurrentUser={isCurrentUser}
            senderImage={sender.imageUrl}
            lastByUser={lastByUser}
            content={message.content}
            createdAt={message.createdAt}
            type={message.type}
            Seen={seenMessage}
            senderName={sender.username}
          />
        );
      })}
    </div>
  );
};
