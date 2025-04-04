import { action } from "./_generated/server";
import { fetchAirtableLevels } from "./models/airtable";
import { migrateLevel } from "./models/migration";

export const migrateFromAirtable = action({
  args: {},
  handler: async (ctx) => {
    try {
      // Fetch levels from Airtable
      const levels = await fetchAirtableLevels();

      // Migrate each level
      for (const level of levels) {
        await migrateLevel(ctx, level);
        console.log(`Migrated level: ${level.title}`);
      }

      return { success: true, message: "Migration completed successfully" };
    } catch (error) {
      console.error("Migration failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },
});