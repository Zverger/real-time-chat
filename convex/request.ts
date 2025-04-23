import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser, getUsersFriendship } from "./_utils";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (args.email === currentUser.email) {
      throw new ConvexError("You can't send a request to yourself!");
    }

    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("User could not be found");
    }

    const requestSentToFriend = await getUsersFriendship(
      ctx,
      currentUser._id,
      receiver._id,
    );

    if (requestSentToFriend) {
      throw new ConvexError("Yout can`t send request to your current friend!");
    }

    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_reciever_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id),
      )
      .unique();
    if (requestAlreadySent) throw new ConvexError("Request already sent");

    const requestAlreadyRecieved = await ctx.db
      .query("requests")
      .withIndex("by_reciever_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id),
      )
      .unique();

    if (requestAlreadyRecieved) {
      throw new ConvexError("This user has already sent to you a request");
    }

    const request = await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});

export const deny = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const request = await ctx.db.get(args.id);

    if (!request || request.receiver !== currentUser._id)
      throw new ConvexError("There is an error denying this request");

    await ctx.db.delete(request._id);
  },
});

export const accept = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const request = await ctx.db.get(args.id);

    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("There is an error accepting this request");
    }

    await ctx.db.delete(request._id);

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId,
    });
    await ctx.db.insert("conversationMembers", {
      memberId: request.sender,
      conversationId,
    });

    await ctx.db.insert("friendships", {
      user1Id: currentUser._id,
      user2Id: request.sender,
      createdAt: Date.now(),
      conversationId,
    });
  },
});
