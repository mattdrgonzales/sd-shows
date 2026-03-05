export type Bucket =
  | "today"
  | "tomorrow"
  | "this weekend"
  | "next weekend"
  | "upcoming";

export interface Event {
  event_id: string;
  event_uid: string;
  artist: string;
  date: string; // YYYY-MM-DD
  venue: string;
  region: string;
  bucket: Bucket;
  source_url: string;
  source_name: string;
  artist_image: string | null;
}

export const BUCKET_ORDER: Bucket[] = [
  "today",
  "tomorrow",
  "this weekend",
  "next weekend",
  "upcoming",
];
