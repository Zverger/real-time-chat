import { FC } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
} from "@/components/ui";
import { Check, User, X } from "lucide-react";

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
        <Button size="icon" onClick={() => {}}>
          <Check />
        </Button>
        <Button size="icon" variant="destructive" onClick={() => {}}>
          <X />
        </Button>
      </div>
    </Card>
  );
};
