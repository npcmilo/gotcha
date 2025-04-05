import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import "dotenv/config";
import { fetchAirtableLevels } from "../convex/models/airtable";

// const CONVEX_URL = process.env.CONVEX_URL || "https://pleasant-shepherd-310.convex.cloud"; // Load from .env.local
const CONVEX_URL = "https://acoustic-sardine-55.convex.cloud"; // Load from .env.local

/**
 * Uploads an image to Convex storage and returns the URL
 */
async function uploadImageToConvex(client: ConvexClient, url: string): Promise<string> {
  // Download the file
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
  }

  const blob = await response.blob();

  // Generate upload URL
  const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {
    contentType: blob.type,
  });

  // Upload to Convex
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: blob,
    headers: {
      "Content-Type": blob.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file to Convex: ${uploadResponse.statusText}`);
  }

  // Get the storage ID from the response
  const { storageId } = await uploadResponse.json();

  // Get the URL for the uploaded file
  const fileUrl = await client.mutation(api.storage.getUrl, {
    storageId,
  });

  if (!fileUrl) {
    throw new Error(`Failed to get URL for storage ID: ${storageId}`);
  }

  return fileUrl;
}

async function migrate() {
  const client = new ConvexClient(CONVEX_URL);

  // 1. Fetch all levels from Airtable
  const airtableLevels = await fetchAirtableLevels();

  for (const level of airtableLevels) {
    // 2. Create level in Convex
    const levelId = await client.mutation(api.levels.create, {
      title: level.title,
      audioUrl: level.audio || undefined,
    });

    // 3. Upload real images to Convex storage
    const realImagePromises = level.realImages.map(async (url) => {
      const fileUrl = await uploadImageToConvex(client, url);

      // Create image in the database
      return client.mutation(api.images.create, {
        levelId,
        url: fileUrl,
        isAiGenerated: false,
      });
    });

    // 4. Upload AI images to Convex storage
    const aiImagePromises = level.aiImages.map(async (url) => {
      const fileUrl = await uploadImageToConvex(client, url);

      // Create image in the database
      return client.mutation(api.images.create, {
        levelId,
        url: fileUrl,
        isAiGenerated: true,
      });
    });

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
