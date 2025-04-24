"use client";
import { FC, PropsWithChildren, SyntheticEvent, useRef } from "react";
import { cn } from "@/lib";
import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui";
import { z } from "zod";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import TextareaAutosize from "react-textarea-autosize";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps extends PropsWithChildren {
  className?: string;
}

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "This field can`t be empty" }),
});

export const ChatInput: FC<ChatInputProps> = ({ className, children }) => {
  const textareaRef = useRef<HTMLAreaElement | null>(null);
  const { conversationId } = useConversation();

  const [createMessage, pending] = useMutationState(api.messages.create);

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    form.reset();

    createMessage({
      conversationId,
      type: "text",
      content: [values.content],
    })
      .then(() => {})
      .catch((error) =>
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred",
        ),
      );
  };

  const handleInputChange = (
    event: SyntheticEvent<HTMLTextAreaElement, Event>,
  ) => {
    const { value, selectionStart } = event.target as HTMLInputElement;
    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  return (
    <Card className={cn("relative w-full rounded-lg p-2", className)}>
      <div className="flex w-full items-end gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full items-end gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormControl>
                    <TextareaAutosize
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          await form.handleSubmit(handleSubmit)();
                        }
                      }}
                      rows={1}
                      maxRows={3}
                      {...field}
                      onChange={handleInputChange}
                      onClick={handleInputChange}
                      placeholder="Type a message..."
                      className="bg-card placeholder:text-muted-foreground min-h-full w-full resize-none border-0 p-1.5 outline-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button size="icon" type="submit" disabled={pending}>
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};
