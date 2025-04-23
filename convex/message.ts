import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversation"),
    type: v.string(),

    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = getCurrentUser(ctx);
  },
});
