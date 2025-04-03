import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import "dotenv/config";

export interface Level {
  title: string;
  realImages: string[];
  aiImages: string[];
  audio: string;
}

async function fetchLevels(): Promise<Level[]> {
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const TABLE_NAME = process.env.TABLE_NAME;

  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    console.error(
      "Missing AIRTABLE_BASE_ID or AIRTABLE_API_KEY in environment variables.",
    );
    return [];
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Airtable fetch failed", res.statusText);
    return [];
  }

  const data = await res.json();

  return data.records.map((record: any) => ({
    title: record.fields["title"],
    realImages: (record.fields["realImages"] || []).map((img: any) => img.url),
    aiImages: (record.fields["aiImages"] || []).map((img: any) => img.url),
    audio: record.fields["audio"]?.[0]?.url || "",
  }));
}
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
