import { ActionCtx } from "../_generated/server";
import { AirtableLevel } from "./airtable";
import { api } from "../_generated/api";

export async function migrateLevel(
  ctx: ActionCtx,
  level: AirtableLevel
): Promise<void> {
  // Create level
  const levelId = await ctx.runMutation(api.levels.create, {
    title: level.title,
    audioUrl: level.audio || undefined,
  });

  // Create real images
  const realImagePromises = level.realImages.map((url) =>
    ctx.runMutation(api.images.create, {
      levelId,
      url,
      isAiGenerated: false,
    })
  );

  // Create AI images
  const aiImagePromises = level.aiImages.map((url) =>
    ctx.runMutation(api.images.create, {
      levelId,
      url,
      isAiGenerated: true,
    })
  );

  // Wait for all images to be created
  await Promise.all([...realImagePromises, ...aiImagePromises]);
}