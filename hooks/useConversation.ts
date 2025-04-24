import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
  const params = useParams<{
    conversationId: Id<"conversations">;
  }>();
  const conversationId = useMemo(
    () => params?.conversationId || ("" as Id<"conversations">),
    [params?.conversationId],
  );
  const isActive = useMemo(() => Boolean(conversationId), [conversationId]);
  return { isActive, conversationId };
};
