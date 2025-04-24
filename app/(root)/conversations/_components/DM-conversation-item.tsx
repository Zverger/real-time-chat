import { FC, PropsWithChildren } from "react";

import { Id } from "@/convex/_generated/dataModel";

import { User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Card } from "@/components/ui";

interface Props extends PropsWithChildren {
  className?: string;
  id: Id<"conversations">;
  lastMessageSender?: string;
  lastMessageContent?: string;
  imageUrl?: string;
  username?: string;
  isGroup?: boolean;
}

export const DMConversationItem: FC<Props> = ({
  id,
  imageUrl,
  username = "",
  lastMessageContent,
  isGroup,
  lastMessageSender,
}) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="flex flex-row items-center gap-4 truncate p-2">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{username}</h4>
            {lastMessageSender && lastMessageContent ? (
              <span className="text-muted-foreground flex truncate text-sm overflow-ellipsis">
                {isGroup && (
                  <p className="font-semibold">
                    {lastMessageSender}
                    {":"}&nbsp;
                  </p>
                )}
                <p className="truncate overflow-ellipsis">
                  {lastMessageContent}
                </p>
              </span>
            ) : (
              <p className="text-muted-foreground truncate text-sm">
                Start a conversation
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
