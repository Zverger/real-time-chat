import { ConversationFallback } from "@/components/shared";
import { ReactNode } from "react";

interface PageProps {
  children?: ReactNode;
}

export default function Page({ children }: PageProps) {
  return <ConversationFallback />;
}
