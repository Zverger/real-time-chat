import { FC, ReactNode } from "react";
import { cn } from "@/lib";

import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { getDateMonthRu } from "@/lib/utils";

interface MessageProps {
  className?: string;
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  firstByDay?: boolean;
  content: string[];
  createdAt: number;
  type: string;
  Seen?: ReactNode;
  zIndex: number;
}

export const Message: FC<MessageProps> = ({
  className,
  fromCurrentUser,
  senderImage,
  lastByUser,
  senderName,
  firstByDay,
  content,
  createdAt,
  type,
  Seen,
  zIndex = 0,
}) => {
  const formatTime = (timeStamp: number) => format(timeStamp, "HH:mm");

  return (
    <>
      <div
        className={cn(
          "flex items-end",
          { "justify-end": fromCurrentUser },
          className,
        )}
      >
        <div
          className={cn("mx-2 flex w-full flex-col", {
            "order-1 items-end": fromCurrentUser,
            "order-2 items-start": !fromCurrentUser,
          })}
        >
          <div
            className={cn("max-w-[70%] rounded-lg px-4 py-2", {
              "bg-primary text-primary-foreground": fromCurrentUser,
              "bg-secondary text-secondary-foreground": !fromCurrentUser,
              "rounded-br-none": !lastByUser && fromCurrentUser,
              "rounded-bl-none": !lastByUser && !fromCurrentUser,
            })}
          >
            {type === "text" ? (
              <p className="text-wrap break-words break-all whitespace-pre-wrap">
                {content}
              </p>
            ) : null}
            <p
              className={cn("my-1 flex w-full text-xs", {
                "text-primary-foreground justify-end": fromCurrentUser,
                "text-secondary-foreground justify-start": !fromCurrentUser,
              })}
            >
              {formatTime(createdAt)}
            </p>
          </div>
          {Seen}
        </div>
        <Avatar
          className={cn("relative h-8 w-8", {
            "order-2": fromCurrentUser,
            "order-1": !fromCurrentUser,
            invisible: lastByUser,
          })}
        >
          <AvatarImage src={senderImage} />
          <AvatarFallback>{senderName.substring(0, 1)}</AvatarFallback>
        </Avatar>
      </div>
      {firstByDay && (
        <div
          className="revert-layer sticky top-0 flex items-center justify-center"
          style={{ zIndex }}
        >
          <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 text-center">
            {getDateMonthRu(createdAt)}
          </div>
        </div>
      )}
    </>
  );
};
