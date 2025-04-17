import { MessageSquareIcon, Moon, Sun, UsersRound } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { headers } from "next/headers";
import { Icon } from "@/components/ui";
import { UserButton } from "@clerk/nextjs";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const pathname = (await headers()).get("x-current-path");
  console.log(pathname);
  const darkMode = false;
  const SwitherIcon = darkMode ? Moon : Sun;
  return (
    <div className="flex h-full w-screen gap-2 p-4">
      <div className="flex w-20 flex-col justify-between border-1 border-gray-300">
        <div className="mx-auto flex flex-col items-center gap-3 px-2 py-3">
          <Link href="/conversations">
            <Icon size={28} icon={MessageSquareIcon} />
          </Link>
          <Link href="/friends">
            <Icon size={28} icon={UsersRound} />
          </Link>
        </div>
        <div className="mx-auto flex flex-col items-center gap-3 px-2 py-3">
          <Icon size={28} icon={SwitherIcon} />

          <UserButton />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
