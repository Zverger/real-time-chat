import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx, req) => {
    const currentUser = await getCurrentUser(ctx);

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_reciever", (q) => q.eq("receiver", currentUser._id))
      .collect();

    const requestsWithSender = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.sender);
        if (!sender) throw new ConvexError("Request sender could not be found");
        return { sender, request };
      }),
    );
    return requestsWithSender;
  },
});

export const count = query({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_reciever", (q) => q.eq("receiver", currentUser._id))
      .collect();

    return requests.length;
  },
});
