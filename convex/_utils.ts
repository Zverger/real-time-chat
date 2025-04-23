import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

const getUserByClerkId = async ({
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
  const friendship1 = await ctx.db
    .query("friendships")
    .withIndex("by_userId_friendId", (q) =>
      q.eq("user1Id", user1Id).eq("user2Id", user2Id),
    )
    .first();

  if (friendship1) return friendship1;

  return await ctx.db
    .query("friendships")
    .withIndex("by_userId_friendId", (q) =>
      q.eq("user1Id", user2Id).eq("user2Id", user1Id),
    )
    .first();
};

export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unothaurized");

  const currentUser = await getUserByClerkId({
    ctx,
    clerkId: identity.subject,
  });

  if (!currentUser) throw new ConvexError("User was not found");

  return currentUser;
};
