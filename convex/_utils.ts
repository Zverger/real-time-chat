import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

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

export const getUserFriends = async (
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
) => {
  const friendship1 = await ctx.db
    .query("friendships")
    .withIndex("by_user1Id", (q) => q.eq("user1Id", userId))
    .collect();
  const friendship2 = await ctx.db
    .query("friendships")
    .withIndex("by_user2Id", (q) => q.eq("user2Id", userId))
    .collect();

  const friends = await Promise.all(
    [...friendship1, ...friendship2].map(async (friendship) => {
      const friendId =
        userId === friendship.user1Id ? friendship.user2Id : friendship.user1Id;
      const friend = await ctx.db.get(friendId);

      if (!friend) throw new ConvexError("Friend user was not found");
      return {
        id: friend._id,
        username: friend.username,
        email: friend.email,
        imageUrl: friend.imageUrl,
        addedAt: friendship._creationTime,
      };
    }),
  );
  return friends;
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

export const getOtherUser = (
  users: { user1: string; user2: string },
  currentUser: string,
) => {
  return users.user1 === currentUser ? users.user2 : users.user1;
};
