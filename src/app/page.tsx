import { fetchUpcomingEvents } from "@/lib/airtable";
import { fetchArtistImages } from "@/lib/spotify";
import { EventsPage } from "@/components/events-page";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Home() {
  const events = await fetchUpcomingEvents();
  const venues = [...new Set(events.map((e) => e.venue))].sort();
  const artists = [...new Set(events.map((e) => e.artist))].sort();

  // Fetch artist images from Spotify (gracefully degrades if no creds)
  const imageMap = await fetchArtistImages(artists);

  // Merge images into events
  const eventsWithImages = events.map((e) => ({
    ...e,
    artist_image: imageMap.get(e.artist) ?? null,
  }));

  return <EventsPage events={eventsWithImages} venues={venues} artists={artists} />;
}
