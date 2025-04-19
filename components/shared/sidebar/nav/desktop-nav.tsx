"use client";

import { Button, Card, ThemeToggle, TooltipContent } from "@/components/ui";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Tooltip, TooltipTrigger } from "@/components/ui";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function DesktopNav() {
  const paths = useNavigation();
  return (
    <Card className="hidden lg:flex lg:h-full lg:w-16 lg:flex-col lg:items-center lg:justify-between lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
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
                    {path.count && (
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
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </Card>
  );
}
