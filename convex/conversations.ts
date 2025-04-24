import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./_utils";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
      conversations.map(async (conversation) => {
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
        if (conversation.isGroup) return { conversation, lastMessage };
        else {
          const otherMembership = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id,
          )[0];

          const otherMember = await ctx.db.get(otherMembership.memberId);
          return {
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
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMembership.lastSeenMessage,
        },
        otherMembers: null,
      };
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
