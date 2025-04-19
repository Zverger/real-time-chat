import { FC, PropsWithChildren } from "react";

import { SidebarWrapper } from "@/components/shared";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;
