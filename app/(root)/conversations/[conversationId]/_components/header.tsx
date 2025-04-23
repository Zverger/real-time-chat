import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib";
import { Avatar, AvatarFallback, AvatarImage, Card } from "@/components/ui";
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";

interface HeaderProps {
  className?: string;
  imageUrl?: string;
  name?: string;
}

export const Header: FC<HeaderProps> = ({
  imageUrl = "",
  name = "",
  className,
}) => {
  return (
    <Card
      className={cn(
        "flex w-full items-center justify-between rounded-lg p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link className="block lg:hidden" href="/conversations">
          <CircleArrowLeft />
        </Link>
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
    </Card>
  );
};
