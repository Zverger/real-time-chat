import { FC } from "react";

import { Id } from "@/convex/_generated/dataModel";

import Link from "next/link";
import { Avatar, AvatarFallback, Card } from "@/components/ui";
import { Badge } from "@/components/ui/badge";

interface Props {
  className?: string;
  id: Id<"conversations">;
  lastMessageSender?: string;
  lastMessageContent?: string;
  name: string | undefined;
  unseenCount?: number;
  isGroup?: boolean;
}

export const GroupConversationItem: FC<Props> = ({
  id,
  name = "",
  unseenCount = 0,
  lastMessageContent,
  isGroup,
  lastMessageSender,
}) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="flex flex-row items-center justify-between p-2">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarFallback>
              {name.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name}</h4>
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
        {unseenCount > 0 && <Badge>{unseenCount}</Badge>}
      </Card>
    </Link>
  );
};
