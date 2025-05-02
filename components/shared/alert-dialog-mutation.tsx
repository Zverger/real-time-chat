"use client";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

import { useMutationState } from "@/hooks";

import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { FunctionReference, OptionalRestArgs } from "convex/server";

interface Props<Mutation extends FunctionReference<"mutation">>
  extends PropsWithChildren {
  api: Mutation;
  args: OptionalRestArgs<Mutation>[0];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  successMessage?: string;
  routeBack?: string;
  cansellLabel?: string;
  submitLabel?: string;
  className?: string;
}

export function AlertDialogMutation<
  Mutation extends FunctionReference<"mutation">,
>({
  className,
  api,
  args,
  open,
  setOpen,
  children,
  title,
  successMessage,
  routeBack,
  submitLabel,
  cansellLabel,
}: Props<Mutation>) {
  const [mutation, { isPending }] = useMutationState(api);

  const route = useRouter();
  function handleAction() {
    mutation(args)
      .then(() => successMessage && toast.success(successMessage))
      .catch((e) =>
        e instanceof ConvexError ? e.data : "Unexpected error occurred",
      );
    if (routeBack) {
      route.replace(routeBack);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(b) => {
        setOpen(b);
      }}
    >
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cansellLabel || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleAction}>
            {submitLabel || "Submit action"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
