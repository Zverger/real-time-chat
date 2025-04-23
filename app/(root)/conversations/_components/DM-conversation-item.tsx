import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ItemList } from "@/components/shared";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Card } from "@/components/ui";

interface Props extends PropsWithChildren {
  className?: string;
  id: Id<"conversations">;

  imageUrl?: string;
  username?: string;
}

export const DMConversationItem: FC<Props> = ({
  className,
  children,
  id,
  imageUrl,
  username = "",
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
            <p className="text-muted-foreground truncate text-sm">
              Start a conversation
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
