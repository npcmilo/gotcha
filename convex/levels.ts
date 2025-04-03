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


export const getShuffledLevels = query({
  handler: async (ctx) => {
    const levels = await ctx.db.query("levels").collect();
    if (levels.length === 0) return [];

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

    const validLevels = levelsWithImages.filter(
      (level) => level.title && level.images.length > 0
    );

    // Fisher-Yates shuffle
    for (let i = validLevels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validLevels[i], validLevels[j]] = [validLevels[j], validLevels[i]];
    }

    return validLevels;
  },
});
