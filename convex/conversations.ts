import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./_utils";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { parseArgs } from "util";

export const getAll = query({
  args: {},
  handler: async (ctx, req) => {
    const currentUser = await getCurrentUser(ctx);

    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      conversationMemberships?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);

        if (!conversation)
          throw new ConvexError("Conversation could not be found");

        return conversation;
      }),
    );
    const conversationsWithDetailts = await Promise.all(
      conversations.map(async (conversation, index) => {
        const allConversationMemberships = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation?._id),
          )
          .collect();
        const lastMessage = await getLastMessageDetails({
          ctx,
          id: conversation.lastMessageId,
        });

        const lastSeenMessage = conversationMemberships[index].lastSeenMessage
          ? await ctx.db.get(conversationMemberships[index].lastSeenMessage)
          : null;

        const lastSeenMessageTime = lastSeenMessage?._creationTime || -1;

        const unseenMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id),
          )
          .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
          .filter((q) => q.neq(q.field("senderId"), currentUser._id))
          .collect();

        if (conversation.isGroup) {
          return {
            conversation,
            lastMessage,
            unseenCount: unseenMessages.length,
          };
        } else {
          const otherMembership = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id,
          )[0];

          const otherMember = await ctx.db.get(otherMembership.memberId);
          return {
            unseenCount: unseenMessages.length,
            conversation,
            otherMember,
            lastMessage,
          };
        }
      }),
    );
    return conversationsWithDetailts;
  },
});

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new ConvexError("Converstion not found");

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId_memberId", (q) =>
        q
          .eq("conversationId", conversation._id)
          .eq("memberId", currentUser._id),
      )
      .unique();
    if (!membership) throw new ConvexError("Unnable to access");

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", conversation._id),
      )
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id,
      )[0];
      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      return {
        ...conversation,
        otherMember: otherMemberDetails
          ? {
              id: otherMemberDetails._id,
              username: otherMemberDetails.username,
              imageUrl: otherMemberDetails.imageUrl,
              email: otherMemberDetails.email,
              createdAt: otherMemberDetails._creationTime,
              lastSeenMessageId: otherMembership.lastSeenMessage,
            }
          : null,
        otherMembers: null,
      };
    } else {
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter((membership) => membership.memberId != currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId);
            if (!member) {
              throw new ConvexError("Member could cont be found");
            }
            return {
              id: member._id,
              username: member.username,
              imageUrl: member.imageUrl,
              email: member.email,
              createdAt: member._creationTime,
            };
          }),
      );
      return { ...conversation, otherMembers, otherMember: null };
    }
  },
});

const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id?: Id<"messages">;
}) => {
  if (!id) return null;

  const message = await ctx.db.get(id);
  if (!message) return null;

  const sender = await ctx.db.get(message.senderId);
  if (!sender) return null;

  const content = getMessageContent(
    message.type,
    message.content as unknown as string,
  );
  return {
    content,
    sender: sender.username,
  };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    default:
      return "[Non-text]";
  }
};

export const createGroup = mutation({
  args: { members: v.array(v.id("users")), name: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
    });
    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) => {
        await ctx.db.insert("conversationMembers", {
          memberId,
          conversationId,
        });
      }),
    );
  },
});

export const deleteGroup = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    const conversationMembers = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
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

    await ctx.db.delete(args.conversationId);
  },
});

export const leaveGroup = mutation({
  args: { conversationId: v.id("conversations") },
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
      throw new ConvexError("You are not member of this conversation");

    await ctx.db.delete(membership?._id);

    const otherConversationMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .first();

    if (!otherConversationMembership) {
      await ctx.db.delete(args.conversationId);
    }
  },
});

export const markRead = mutation({
  args: { conversationId: v.id("conversations"), messageId: v.id("messages") },
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

    if (!membership) {
      throw new ConvexError("You are not member of this conversation");
    }
    const lastSeenMessage = (await ctx.db.get(args.messageId))?._id;
    if (lastSeenMessage !== membership.lastSeenMessage) {
      await ctx.db.patch(membership._id, { lastSeenMessage });
    }
  },
});
