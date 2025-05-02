"use client";
import { FC, useRef } from "react";
import { cn } from "@/lib";
import { z } from "zod";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";

import { useMutationState } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  TooltipContent,
  TooltipTrigger,
  Avatar,
} from "@/components/ui";
import { Tooltip } from "@radix-ui/react-tooltip";
import { CirclePlus, X } from "lucide-react";

interface CreateGroupDialogProps {
  className?: string;
}

const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "This field cannot be empty" }),
  members: z
    .string()
    .array()
    .min(1, { message: "You must select at least 1 friend" }),
});

export const CreateGroupDialog: FC<CreateGroupDialogProps> = ({
  className,
}) => {
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const { data: friends } = useQuery(api.friendships.getAll);

  const [createGroup, pending] = useMutationState(
    api.conversations.createGroup,
  );

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: { name: "", members: [] },
  });

  const members = form.watch("members", []);

  const unselectedFriends =
    friends?.filter((friend) => !members.includes(friend.id)) || [];

  const handleSubmit = (values: z.infer<typeof createGroupFormSchema>) => {
    createGroup({
      members: values.members as Id<"users">[],
      name: values.name,
    })
      .catch((error) =>
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred",
        ),
      )
      .finally(() => form.reset());

    dialogTriggerRef.current?.click();
  };
  return (
    <Dialog>
      <DialogTrigger ref={dialogTriggerRef}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="p-1" size="icon" variant="outline">
              <CirclePlus />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Create group chat</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>

      <DialogContent className={cn("block", className)}>
        <DialogHeader>
          <DialogTitle>Create group chat</DialogTitle>
          <DialogDescription>
            Add your friends to get started!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Group name ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Friends</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={unselectedFriends.length === 0}
                      >
                        <Button className="w-full" variant="outline">
                          Select
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {unselectedFriends?.map((friend) => (
                          <DropdownMenuCheckboxItem
                            key={friend.id}
                            className="flex w-full items-center gap-2 p-2"
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("members", [
                                  ...members,
                                  friend.id,
                                ]);
                              }
                            }}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={friend.imageUrl} />
                              <AvatarFallback>
                                {friend.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h4 className="truncate">{friend.username}</h4>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {members && members.length ? (
              <Card className="no-scrollbar flex h-24 w-full items-center justify-center gap-3 overflow-x-auto p-2">
                {friends
                  ?.filter((friend) => members.includes(friend.id))
                  .map((friend) => (
                    <div
                      key={friend.id}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.imageUrl} />
                          <AvatarFallback>
                            {friend.username.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <X
                          className="text-muted-foreground bg-muted absolute bottom-8 left-7 h-4 w-4 cursor-pointer rounded-full"
                          onClick={() =>
                            form.setValue(
                              "members",
                              members.filter((member) => member !== friend.id),
                            )
                          }
                        />
                      </div>
                      <p className="truncate text-sm">
                        {friend.username.split(" ")[0]}
                      </p>
                    </div>
                  ))}
              </Card>
            ) : null}
            <DialogFooter>
              <Button disabled={pending.isPending} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
