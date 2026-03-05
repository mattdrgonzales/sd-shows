import { computeBucket } from "./bucket";
import type { Bucket, Event } from "./types";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const BASE_URL = "https://api.airtable.com/v0";

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface ListRecordsResponse {
  records: AirtableRecord[];
  offset?: string;
}

async function fetchAllRecords(): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({
      filterByFormula: "AND({bucket} != 'past', {date} != '')",
      "sort[0][field]": "date",
      "sort[0][direction]": "asc",
    });
    if (offset) params.set("offset", offset);

    const url = `${BASE_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent("Upcoming Events")}?${params}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Airtable error ${response.status}: ${await response.text()}`);
    }

    const data: ListRecordsResponse = await response.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

export async function fetchUpcomingEvents(): Promise<Event[]> {
  const records = await fetchAllRecords();

  const events: Event[] = [];

  for (const record of records) {
    const f = record.fields;
    const date = f.date as string;
    if (!date) continue;

    const bucket = computeBucket(date);
    if (bucket === "past") continue;

    events.push({
      event_id: (f.event_id as string) ?? record.id,
      event_uid: (f.event_uid as string) ?? "",
      artist: (f.artist as string) ?? "Unknown Artist",
      date,
      venue: (f.venue as string) ?? "Unknown Venue",
      region: (f.region as string) ?? "SD",
      bucket: bucket as Bucket,
      source_url: (f.source_url as string) ?? "",
      source_name: (f.source_name as string) ?? "",
      artist_image: (f.artist_image as string) ?? null,
    });
  }

  return events;
}
