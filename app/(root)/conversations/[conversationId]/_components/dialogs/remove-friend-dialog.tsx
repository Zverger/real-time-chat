import { Dispatch, FC, SetStateAction } from "react";

import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";

import { AlertDialogMutation } from "@/components/shared";

interface RemoveFriendDialogProps {
  className?: string;
  friendId: Id<"users"> | undefined | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const RemoveFriendDialog: FC<RemoveFriendDialogProps> = ({
  className,
  friendId,
  open,
  setOpen,
}) => {
  if (!friendId) return null;
  return (
    <AlertDialogMutation
      className={className}
      api={api.friendships.remove}
      args={{ friendId }}
      open={open}
      setOpen={setOpen}
      routeBack="/conversations"
      successMessage="Friend removed!"
      submitLabel="Remove friend"
    >
      This action can not be undone! This user will be removed from your friend
      list and all private messages with your friend will removed as well!.
      <br /> <br />
      Other group and private chats will work as normal
    </AlertDialogMutation>
  );
};
