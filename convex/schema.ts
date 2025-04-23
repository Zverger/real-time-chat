import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),

    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  requests: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  })
    .index("by_reciever", ["receiver"])
    .index("by_reciever_sender", ["receiver", "sender"]),

  friendships: defineTable({
    user1Id: v.id("users"), // The user who has a friend
    user2Id: v.id("users"), // The friend (also a user)
    // Optional additional fields about the friendship
    createdAt: v.number(),
    conversationId: v.id("conversations"),
    // status: v.string(),    // e.g., "pending", "accepted"
  })
    .index("by_user1Id", ["user1Id"])
    .index("by_user2Id", ["user2Id"])
    .index("by_userId_friendId", ["user1Id", "user2Id"])

    .index("by_conversationId", ["conversationId"]),

  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),
  conversationMembers: defineTable({
    memberId: v.id("users"),
    conversationId: v.id("conversations"),
    lastSeenMessage: v.optional(v.id("messages")),
  })
    .index("by_memberId", ["memberId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_conversationId_memberId", ["conversationId", "memberId"]),

  messages: defineTable({
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  }).index("by_conversationId", ["conversationId"]),
});
