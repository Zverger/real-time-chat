import { Id } from "./_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

export const getUserByClerkId = async ({
  ctx,
  clerkId,
}: {
  ctx: QueryCtx | MutationCtx;
  clerkId: string;
}) => {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
};

export const getUsersFriendship = async (
  ctx: QueryCtx | MutationCtx,
  user1Id: Id<"users">,
  user2Id: Id<"users">,
) => {
  return (
    (await ctx.db
      .query("friendships")
      .withIndex("by_userId_friendId", (q) =>
        q.eq("userId", user1Id).eq("friendId", user2Id),
      )
      .unique()) ||
    (await ctx.db
      .query("friendships")
      .withIndex("by_userId_friendId", (q) =>
        q.eq("userId", user2Id).eq("friendId", user1Id),
      )
      .unique())
  );
};
