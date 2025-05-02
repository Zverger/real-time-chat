"use client";
import { ItemList } from "@/components/shared";

import { ReactNode } from "react";

import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";

import { Loader2 } from "lucide-react";
import { DMConversationItem } from "./_components/DM-conversation-item";
import { CreateGroupDialog } from "./_components/create-group-dialog";
import { GroupConversationItem } from "./_components/group-conversation-item";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: conversations, status } = useQuery(api.conversations.getAll);

  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog />}>
        {status === "success" ? (
          conversations.length > 0 ? (
            conversations.map(
              ({ conversation, otherMember, lastMessage, unseenCount }) =>
                conversation.isGroup ? (
                  <GroupConversationItem
                    key={conversation._id}
                    name={conversation.name}
                    id={conversation._id}
                    lastMessageContent={lastMessage?.content}
                    lastMessageSender={lastMessage?.sender}
                    unseenCount={unseenCount}
                  />
                ) : (
                  <DMConversationItem
                    key={conversation._id}
                    id={conversation._id}
                    username={otherMember?.username}
                    imageUrl={otherMember?.imageUrl}
                    lastMessageContent={lastMessage?.content}
                    lastMessageSender={lastMessage?.sender}
                    unseenCount={unseenCount}
                  />
                ),
            )
          ) : (
            <p className="flex h-full w-full items-center justify-center">
              No conversations found
            </p>
          )
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </ItemList>
      {children}
    </>
  );
}
