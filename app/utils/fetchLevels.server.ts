import "dotenv/config";

export interface Level {
  title: string;
  realImages: string[];
  aiImages: string[];
  audio: string;
}

export async function fetchLevels(): Promise<Level[]> {
  const AIRTABLE_BASE_ID = "appdnmf5KCT91EJAU";
  const AIRTABLE_API_KEY =
    "patf4dnHoImXaSrcR.e0a01c3c2c96e43f00d6b9494d9c1071a99af1e5d82b34a45358633c63f550b1";
  const TABLE_NAME = "tblVOr6PVk64vRpwG";

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
