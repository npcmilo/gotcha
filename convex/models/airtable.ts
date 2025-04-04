export interface AirtableLevel {
  title: string;
  realImages: string[];
  aiImages: string[];
  audio: string;
}

export interface AirtableRecord {
  fields: {
    title: string;
    realImages: Array<{ url: string }>;
    aiImages: Array<{ url: string }>;
    audio?: Array<{ url: string }>;
  };
}

export async function fetchAirtableLevels(): Promise<AirtableLevel[]> {
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const TABLE_NAME = process.env.TABLE_NAME;

  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY || !TABLE_NAME) {
    throw new Error("Missing required Airtable environment variables");
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Airtable fetch failed: ${res.statusText}`);
  }

  const data = await res.json();

  return data.records.map((record: AirtableRecord) => ({
    title: record.fields.title,
    realImages: (record.fields.realImages || []).map((img) => img.url),
    aiImages: (record.fields.aiImages || []).map((img) => img.url),
    audio: record.fields.audio?.[0]?.url || "",
  }));
}