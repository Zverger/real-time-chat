"use client";

import { Button, Card, ThemeToggle, TooltipContent } from "@/components/ui";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Tooltip, TooltipTrigger } from "@/components/ui";
import Link from "next/link";
import { useConversation } from "@/hooks/useConversation";
import { Badge } from "@/components/ui/badge";

export function MobileNav() {
  const paths = useNavigation();

  const { isActive } = useConversation();

  if (isActive) return null;

  return (
    <Card className="fixed bottom-4 flex h-16 w-[calc(100vw-32px)] items-center p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex items-center justify-evenly">
          {paths.map((path, id) => (
            <li className="relative" key={id}>
              <Link href={path.href}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      asChild={true}
                      size="icon"
                      variant={path.active ? "default" : "outline"}
                      className="p-1"
                    >
                      {path.icon}
                    </Button>
                    {!!path.count && (
                      <Badge className="absolute bottom-7 left-6 px-2">
                        {path.count}
                      </Badge>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{path.name}</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
}
