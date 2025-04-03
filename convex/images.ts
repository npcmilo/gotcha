import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    levelId: v.id("levels"),
    url: v.string(),
    isAiGenerated: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("images", {
      levelId: args.levelId,
      url: args.url,
      isAiGenerated: args.isAiGenerated,
    });
  },
});