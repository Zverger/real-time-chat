import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),

    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId_memberId", (q) =>
        q
          .eq("conversationId", args.conversationId)
          .eq("memberId", currentUser._id),
      )
      .unique();
    if (!membership)
      throw new ConvexError("You aren`t member of this conversation");
    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
    });

    await ctx.db.patch(args.conversationId, { lastMessageId: message });
    return message;
  },
});

export const getAll = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId_memberId", (q) =>
        q
          .eq("conversationId", args.conversationId)
          .eq("memberId", currentUser._id),
      )
      .unique();
    if (!membership)
      throw new ConvexError("You aren`t member of this conversation");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("desc")
      .collect();

    const messagesWithUser = Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);

        if (!sender) throw new ConvexError("Could not find sender of message");

        return {
          message: {
            id: message._id,
            createdAt: message._creationTime,
            content: message.content,
            type: message.type,
          },
          sender: {
            id: sender._id,
            username: sender.username,
            email: sender.email,
            imageUrl: sender.imageUrl,
            createdAt: sender._creationTime,
          },
          isCurrentUser: currentUser._id === sender._id,
        };
      }),
    );
    return messagesWithUser;
  },
});
