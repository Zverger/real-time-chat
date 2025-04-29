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

export const DeleteGroupDialog: FC<LeaveGroupDialog> = ({
  className,
  conversationId,
  open,
  setOpen,
}) => {
  if (!conversationId) return null;
  return (
    <AlertDialogMutation
      className={className}
      api={api.conversations.deleteGroup}
      args={{ conversationId }}
      open={open}
      setOpen={setOpen}
      routeBack="/conversations"
      successMessage="Group chat successfully deleted!"
      submitLabel="Delete"
    >
      This action can not be undone! All messages will be deleted and all
      members will not have access to this conversation!.
      <br />
      Other group and private chats will work as normal
    </AlertDialogMutation>
  );
};
