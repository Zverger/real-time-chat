"use client";

import { FC } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
} from "@/components/ui";
import { Check, User, X } from "lucide-react";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

interface RequestProps {
  className?: string;
  id: string;
  email: string;
  imageUrl: string;
  username: string;
}

export const Request: FC<RequestProps> = ({
  className,
  id,
  email,
  imageUrl,
  username,
}) => {
  const [denyRequest, denyPending] = useMutationState(api.request.deny);
  const [acceptRequest, acceptPending] = useMutationState(api.request.accept);

  const handleAccept = () => {
    acceptRequest({ id })
      .then(() => toast.success("Friend request accepted!"))
      .catch((error) =>
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred",
        ),
      );
  };

  const handleDeny = () => {
    denyRequest({ id })
      .then(() => toast.success("Friend request denied!"))
      .catch((error) =>
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred",
        ),
      );
  };

  return (
    <Card className="flex w-full flex-row items-center justify-between gap-2 p-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <p className="text-muted-foreground truncate text-xs">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={denyPending || acceptPending}
          size="icon"
          onClick={handleAccept}
        >
          <Check />
        </Button>
        <Button
          disabled={denyPending || acceptPending}
          size="icon"
          variant="destructive"
          onClick={handleDeny}
        >
          <X />
        </Button>
      </div>
    </Card>
  );
};
