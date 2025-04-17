import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MessageSquareIcon, UsersRound } from "lucide-react";

export const useNavigation = () => {
  const pathName = usePathname();
  const paths = useMemo(
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
      },
    ],
    [pathName],
  );

  return paths;
};
