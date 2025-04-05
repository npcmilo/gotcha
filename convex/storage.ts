import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Generate a URL for uploading a file to Convex storage
 */
export const generateUploadUrl = mutation({
  args: { contentType: v.string() },
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get a URL for a file in Convex storage
 */
export const getUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
