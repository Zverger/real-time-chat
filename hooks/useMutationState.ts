import { useMutation } from "convex/react";
import { FunctionReference, OptionalRestArgs } from "convex/server";
import { ConvexError } from "convex/values";
import { useCallback, useMemo, useState } from "react";

export function useMutationState<
  Mutation extends FunctionReference<"mutation">,
>(mutation: Mutation) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const mutationFn = useMutation(mutation);
  const [error, setError] = useState<Error | ConvexError<Mutation> | null>(
    null,
  );

  const mutate = useCallback(
    async (...payload: OptionalRestArgs<Mutation>) => {
      setError(null);
      setIsSuccess(false);
      setIsPending(true);
      return mutationFn(...payload)
        .then((res) => {
          setIsSuccess(true);
          return res;
        })
        .catch((error: Error | ConvexError<Mutation>) => {
          setError(error);
        })
        .finally(() => setIsPending(false));
    },
    [mutationFn],
  );

  const pending = useMemo(
    () =>
      isSuccess
        ? ({
            status: "success",
            isSuccess: true,
            error: null,
            isError: false,
            isPending: false,
          } as const)
        : error
          ? ({
              status: "error",
              isSuccess: false,
              error,
              isError: true,
              isPending: false,
            } as const)
          : isPending
            ? ({
                status: "pending",
                isSuccess: false,
                error: null,
                isError: false,
                isPending: true,
              } as const)
            : ({
                status: "not sent",
                isSuccess: false,
                error: null,
                isError: false,
                isPending: false,
              } as const),
    [error, isSuccess],
  );

  return [mutate, pending] as const;
}
