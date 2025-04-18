import { ItemList } from "@/components/shared";
import { ConversationFallback } from "@/components/shared";
import { ReactNode } from "react";

interface PageProps {
  children?: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <>
      <ItemList title="Friends">das</ItemList>
    </>
  );
}
