import { ConversationContainer } from "@/components/shared";
import { ReactNode } from "react";

interface PageProps {
  children?: ReactNode;
}

export default function Page({ children }: PageProps) {
  return <ConversationContainer>ConversationContainer</ConversationContainer>;
}
