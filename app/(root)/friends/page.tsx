"use client";
import { ItemList } from "@/components/shared";

import { ReactNode } from "react";
import { AddFriendDialog } from "./_components/add-friend-dialog";

interface PageProps {
  children?: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>
        das
      </ItemList>
    </>
  );
}
