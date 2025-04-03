// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  levels: defineTable({
    title: v.string(),
    audioUrl: v.optional(v.string()),
  }),

  images: defineTable({
    levelId: v.id("levels"),
    url: v.string(),
    isAiGenerated: v.boolean(),
  }).index("by_level", ["levelId"]),

  // Optional: Only if you want to track game stats
  games: defineTable({
    userId: v.optional(v.string()),
    levelId: v.id("levels"),
    timestamp: v.number(),
    timeElapsedSeconds: v.number(),
    score: v.number(), // Could track correct guesses
  }).index("by_user", ["userId"]),

  guesses: defineTable({
    gameId: v.id("games"),
    imageId: v.id("images"),
    guessedAi: v.boolean(),
    isCorrect: v.boolean(),
  }).index("by_game", ["gameId"]),
});