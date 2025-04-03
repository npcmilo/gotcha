import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    audioUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("levels", {
      title: args.title,
      audioUrl: args.audioUrl,
    });
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const levels = await ctx.db.query("levels").collect();
    const levelsWithImages = await Promise.all(
      levels.map(async (level) => {
        const images = await ctx.db
          .query("images")
          .withIndex("by_level", (q) => q.eq("levelId", level._id))
          .collect();
        return {
          ...level,
          images,
        };
      })
    );
    return levelsWithImages;
  },
});