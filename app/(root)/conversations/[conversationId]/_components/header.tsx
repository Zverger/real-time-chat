import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import Link from "next/link";
import { CircleArrowLeft, Settings } from "lucide-react";

interface HeaderProps {
  className?: string;
  imageUrl?: string;
  name?: string;
  options?: {
    label: string;
    destructive?: boolean;
    onClick: () => void;
  }[];
}

export const Header: FC<HeaderProps> = ({
  imageUrl = "",
  name = "",
  className,
  options,
}) => {
  return (
    <Card
      className={cn(
        "flex w-full flex-row items-center justify-between rounded-lg p-2",
        className,
      )}
    >
      <div className="hidden lg:block" />
      <Link className="block lg:hidden" href="/conversations">
        <CircleArrowLeft />
      </Link>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      {options && (
        <div className="flex gap-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option, id) => (
                <DropdownMenuItem
                  key={id}
                  onClick={option.onClick}
                  className={cn("font-semibold", {
                    "text-destructive": option.destructive,
                  })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Card>
  );
};
