import { fetchUpcomingEvents } from "@/lib/airtable";
import { EventsPage } from "@/components/events-page";

export default async function Home() {
  const events = await fetchUpcomingEvents();
  const venues = [...new Set(events.map((e) => e.venue))].sort();

  return <EventsPage events={events} venues={venues} />;
}
