// test-fetch-levels.ts
import { fetchLevels } from "./app/utils/fetchLevels.server";
import "dotenv/config";

(async () => {
  try {
    const levels = await fetchLevels();
    console.log("✅ Levels fetched:", levels);
  } catch (error) {
    console.error("❌ Failed to fetch levels:", error);
  }
})();
