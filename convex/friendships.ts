import { ConvexError, convexToJson, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getUserFriends, getUsersFriendship } from "./_utils";

export const getAll = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const friends = await getUserFriends(ctx, currentUser._id);
    return friends;
  },
});

export const remove = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const friendship = await getUsersFriendship(
      ctx,
      currentUser._id,
      args.friendId,
    );
    if (!friendship) {
      throw new ConvexError("This user not found on your friends list");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", friendship.conversationId),
      )
      .collect();

    const conversationMembers = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", friendship.conversationId),
      )
      .collect();

    await Promise.all(
      messages.map(async (message) => {
        ctx.db.delete(message._id);
      }),
    );

    await Promise.all(
      conversationMembers.map(async (members) => {
        ctx.db.delete(members._id);
      }),
    );

    await ctx.db.delete(friendship.conversationId);

    await ctx.db.delete(friendship._id);
  },
});
