"use client";
import { FC, PropsWithChildren } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
  DialogTitle,
  DialogDescription,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  DialogFooter,
} from "@/components/ui";

import { UserPlus } from "lucide-react";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";

import { ConvexError } from "convex/values";
import { toast } from "sonner";

//Валидация формы через встроенную в "shadcn@latest form" библиотеку zod
//https://ui.shadcn.com/docs/components/form
const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can`t be empty" })
    .email("Please enter a valid email"),
});

export const AddFriendDialog: FC = () => {
  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: createRequest, pending } = useMutationState(
    api.request.create,
  );

  const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
    await createRequest({ email: values.email })
      .then(() => {
        form.reset();
        toast.success("Friend request sent!");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occured",
        );
      })
      .finally(() => console.log(1111));
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <Button asChild size="icon" variant="outline">
            <DialogTrigger>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Friend</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send a request to connect with your friends
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={false} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
