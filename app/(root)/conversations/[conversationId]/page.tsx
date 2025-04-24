"use client";
import { ConversationContainer } from "@/components/shared";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Loader2 } from "lucide-react";
import { Header } from "./_components/header";
import { useParams } from "next/navigation";
import { Body } from "./_components/body/body";
import { ChatInput } from "./_components/input/ChatInput";
import getConvexErrorMessage from "@/lib/utils/get-ConvexError-message";
import { useQuery } from "convex-helpers/react";
import { useConversation } from "@/hooks";
export default function Page() {
  const { conversationId } = useConversation();

  const {
    data: conversation,
    status,
    error,
  } = useQuery(api.conversations.get, {
    id: conversationId,
  });

  switch (status) {
    case "pending":
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    case "error":
      return (
        <p className="flex h-full w-full flex-col items-center justify-center gap-2">
          <b>Something gone wrong!</b>

          {getConvexErrorMessage(error.message, "Conversation not found")}
        </p>
      );
    case "success":
      return conversation ? (
        <ConversationContainer>
          <Header
            name={
              conversation.isGroup
                ? conversation.name
                : conversation.otherMember?.username
            }
            imageUrl={
              conversation.isGroup
                ? undefined
                : conversation.otherMember?.imageUrl
            }
          />
          <Body conversationId={conversationId} />
          <ChatInput />
        </ConversationContainer>
      ) : (
        <p className="flex h-full w-full items-center justify-center">
          Conversation not found
        </p>
      );
    default:
      const exhaustCheck: never = status;
      return exhaustCheck;
  }
}
