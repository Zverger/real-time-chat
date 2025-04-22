"use client";
import { ConversationFallback, ItemList } from "@/components/shared";

import { AddFriendDialog } from "./_components/add-friend-dialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { Request } from "./_components/request";

export default function Page() {
  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {requests ? (
          requests.length ? (
            requests.map(({ sender, request }) => (
              <Request
                key={request._id}
                id={request._id}
                imageUrl={sender.imageUrl}
                username={sender.username}
                email={sender.email}
              />
            ))
          ) : (
            <p className="flex h-full w-full items-center justify-center">
              No friends requests found
            </p>
          )
        ) : (
          <Loader2 className="h-8 w-8 animate-spin" />
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
}
