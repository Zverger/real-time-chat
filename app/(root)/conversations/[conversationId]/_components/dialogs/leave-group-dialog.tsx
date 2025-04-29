import { Dispatch, FC, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";

import { AlertDialogMutation } from "@/components/shared";

interface LeaveGroupDialog {
  className?: string;
  conversationId: Id<"conversations"> | undefined | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const LeaveGroupDialog: FC<LeaveGroupDialog> = ({
  className,
  conversationId,
  open,
  setOpen,
}) => {
  if (!conversationId) return null;
  return (
    <AlertDialogMutation
      className={className}
      api={api.conversations.leaveGroup}
      args={{ conversationId }}
      open={open}
      setOpen={setOpen}
      routeBack="/conversations"
      successMessage="Group left!"
      submitLabel="Leave group"
    >
      This action can not be undone! You will not be able to see any previos
      messages or send new message to this group!
    </AlertDialogMutation>
  );
};
