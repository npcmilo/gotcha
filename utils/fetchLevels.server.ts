import "dotenv/config";

export interface Level {
  title: string;
  realImages: string[];
  aiImages: string[];
  audio: string;
}

export async function fetchLevels(): Promise<Level[]> {
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
