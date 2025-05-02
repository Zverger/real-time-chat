"use client";
import { ConversationContainer } from "@/components/shared";
import { api } from "@/convex/_generated/api";

import { CircleArrowLeft, Loader2 } from "lucide-react";
import { Header } from "./_components/header";

import { Body } from "./_components/body/body";
import { ChatInput } from "./_components/input/ChatInput";
import getConvexErrorMessage from "@/lib/utils/get-ConvexError-message";
import { useQuery } from "convex-helpers/react";
import { useConversation } from "@/hooks";
import { useState } from "react";
import { RemoveFriendDialog } from "./_components/dialogs/remove-friend-dialog";
import { DeleteGroupDialog } from "./_components/dialogs/delete-group-dialog";

import Link from "next/link";
import { LeaveGroupDialog } from "./_components/dialogs/leave-group-dialog";
export default function Page() {
  const { conversationId } = useConversation();

  const {
    data: conversation,
    status,
    error,
  } = useQuery(api.conversations.get, {
    id: conversationId,
  });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);

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
          <b className="flex flex-row items-center gap-2">
            <Link
              href="/conversations"
              className="rounded-lg p-1 hover:bg-gray-300 lg:hidden"
            >
              <CircleArrowLeft size={26} />
            </Link>
            Something gone wrong!
          </b>

          <br />
          {getConvexErrorMessage(error.message, "Conversation was not found")}
        </p>
      );
    case "success":
      return conversation ? (
        <ConversationContainer>
          <RemoveFriendDialog
            friendId={conversation.otherMember?.id}
            open={removeFriendDialogOpen}
            setOpen={setRemoveFriendDialogOpen}
          />
          <DeleteGroupDialog
            conversationId={conversation._id}
            open={deleteGroupDialogOpen}
            setOpen={setDeleteGroupDialogOpen}
          />
          <LeaveGroupDialog
            open={leaveGroupDialogOpen}
            conversationId={conversationId}
            setOpen={setLeaveGroupDialogOpen}
          />
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
            options={
              conversation.isGroup
                ? [
                    {
                      label: "Leave group",
                      onClick: () => setLeaveGroupDialogOpen(true),
                    },
                    {
                      label: "Delete group",
                      destructive: true,
                      onClick: () => setDeleteGroupDialogOpen(true),
                    },
                  ]
                : [
                    {
                      label: "Remove from friend list",
                      destructive: true,
                      onClick: () => setRemoveFriendDialogOpen(true),
                    },
                  ]
            }
          />
          <Body
            conversationId={conversationId}
            members={
              conversation.isGroup
                ? conversation.otherMembers
                  ? conversation.otherMembers
                  : []
                : conversation.otherMember
                  ? [conversation.otherMember]
                  : []
            }
          />
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
