import { fetchUpcomingEvents } from "@/lib/airtable";
import { EventsPage } from "@/components/events-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await fetchUpcomingEvents();
  const venues = [...new Set(events.map((e) => e.venue))].sort();
  const artists = [...new Set(events.map((e) => e.artist))].sort();

  return <EventsPage events={events} venues={venues} artists={artists} />;
}
