import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { MessageSquareIcon, UsersRound } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";

export const useNavigation = () => {
  const pathName = usePathname();

  const requestsCount = useQuery(api.requests.count);

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
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <UsersRound />,
        active: pathName.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathName, requestsCount],
  );

  return paths;
};
