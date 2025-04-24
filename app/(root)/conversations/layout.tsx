"use client";
import { ItemList } from "@/components/shared";

import { ReactNode } from "react";

import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";

import { Loader2 } from "lucide-react";
import { DMConversationItem } from "./_components/DM-conversation-item";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: conversations, status } = useQuery(api.conversations.getAll);
  console.log(conversations?.length);
  return (
    <>
      <ItemList title="Conversations">
        {status === "success" ? (
          conversations.length > 0 ? (
            conversations.map(({ conversation, otherMember }) =>
              conversation.isGroup ? null : (
                <DMConversationItem
                  key={conversation._id}
                  id={conversation._id}
                  username={otherMember?.username}
                  imageUrl={otherMember?.imageUrl}
                />
              ),
            )
          ) : (
            <p className="flex h-full w-full items-center justify-center">
              No conversations found
            </p>
          )
        ) : (
          <Loader2 className="spin" />
        )}
      </ItemList>
      {children}
    </>
  );
}
