import { ItemList } from "@/components/shared";

import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <ItemList title="Conversations">Conv page</ItemList>
      {children}
    </>
  );
}
