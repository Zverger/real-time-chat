import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { MessageSquareIcon, UsersRound } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useNavigation = () => {
  const pathName = usePathname();

  const requestsCount = useQuery(api.requests.count);
  const conversations = useQuery(api.conversations.getAll);
  const unseenMessageCount = useMemo(
    () =>
      conversations?.reduce(
        (acc, conversation) => acc + conversation.unseenCount,
        0,
      ),
    [conversations],
  );

  const paths: {
    name: string;
    href: string;
    icon: ReactNode;
    active: boolean;
    count?: ReactNode;
  }[] = useMemo(
    () => [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquareIcon />,
        active: pathName.startsWith("/conversations"),
        count: unseenMessageCount,
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <UsersRound />,
        active: pathName.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathName, requestsCount, unseenMessageCount],
  );

  return paths;
};
