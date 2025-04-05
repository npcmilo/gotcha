import { ActionCtx } from "../_generated/server";
import { AirtableLevel } from "./airtable";
import { api } from "../_generated/api";
import { downloadAndUploadFiles } from "./storage";

export async function migrateLevel(
  ctx: ActionCtx,
  level: AirtableLevel
): Promise<void> {
  // Create level
  const levelId = await ctx.runMutation(api.levels.create, {
    title: level.title,
    audioUrl: level.audio || undefined,
  });

  // Upload real images to Convex storage
  const realImageUrls = await downloadAndUploadFiles(ctx, level.realImages);

  // Upload AI images to Convex storage
  const aiImageUrls = await downloadAndUploadFiles(ctx, level.aiImages);

  // Create real images in the database
  const realImagePromises = realImageUrls.map((url) =>
    ctx.runMutation(api.images.create, {
      levelId,
      url,
      isAiGenerated: false,
    })
  );

  // Create AI images in the database
  const aiImagePromises = aiImageUrls.map((url) =>
    ctx.runMutation(api.images.create, {
      levelId,
      url,
      isAiGenerated: true,
    })
  );

  // Wait for all images to be created
  await Promise.all([...realImagePromises, ...aiImagePromises]);
}