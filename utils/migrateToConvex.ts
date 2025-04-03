import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { fetchLevels } from "../app/utils/fetchLevels.server";

const CONVEX_URL = process.env.CONVEX_URL || "https://pleasant-shepherd-310.convex.cloud"; // Load from .env.local

async function migrate() {
  const client = new ConvexClient(CONVEX_URL);

  // 1. Fetch all levels from Airtable
  const airtableLevels = await fetchLevels();

  for (const level of airtableLevels) {
    // 2. Create level in Convex
    const levelId = await client.mutation(api.levels.create, {
      title: level.title,
      audioUrl: level.audio || undefined,
    });

    // 3. Create real images
    const realImagePromises = level.realImages.map((url) =>
      client.mutation(api.images.create, {
        levelId,
        url,
        isAiGenerated: false,
      })
    );

    // 4. Create AI images
    const aiImagePromises = level.aiImages.map((url) =>
      client.mutation(api.images.create, {
        levelId,
        url,
        isAiGenerated: true,
      })
    );

    // Wait for all images to be created
    await Promise.all([...realImagePromises, ...aiImagePromises]);

    console.log(`Migrated level: ${level.title}`);
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
