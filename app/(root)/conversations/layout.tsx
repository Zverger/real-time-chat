import { Button, Icon } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex w-80 flex-col border-1 border-gray-300 px-2 py-3">
      <label className="flex items-center justify-between">
        <span className="text-2xl font-bold">Conversations</span>
        <Icon size={24} icon={CirclePlus} className="p-1" />
      </label>
      <div className="overflow-y-scroll"></div>
    </div>
  );
}
