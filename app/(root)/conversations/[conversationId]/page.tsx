"use client";
import { ConversationContainer } from "@/components/shared";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { Header } from "./_components/header";
import { useParams } from "next/navigation";
import { Body } from "./_components/body/body";
import { ChatInput } from "./_components/input/ChatInput";

export default function Page() {
  const { conversationId } = useParams<{
    conversationId: Id<"conversations">;
  }>();
  try {
    const conversation = useQuery(api.conversations.get, {
      id: conversationId,
    });
    if (conversation === undefined)
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );

    return conversation ? (
      <ConversationContainer>
        <Header
          name={
            conversation.isGroup
              ? conversation.name
              : conversation.otherMember.username
          }
          imageUrl={
            conversation.isGroup ? undefined : conversation.otherMember.imageUrl
          }
        />
        <Body />
        <ChatInput />
      </ConversationContainer>
    ) : (
      <p className="flex h-full w-full items-center justify-center">
        Conversation not found
      </p>
    );
  } catch (e) {
    return (
      <p className="flex h-full w-full items-center justify-center">
        Conversation not found
      </p>
    );
  }
}
