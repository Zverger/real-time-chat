import { MessageSquareIcon, Moon, Sun, UsersRound } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { headers } from "next/headers";
import { Icon } from "@/components/ui";
import { UserButton } from "@clerk/nextjs";
import { SidebarWrapper } from "@/components/shared";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const pathname = (await headers()).get("x-current-path");
  console.log(pathname);
  const darkMode = false;
  const SwitherIcon = darkMode ? Moon : Sun;
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;
