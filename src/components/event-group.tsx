import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/event-card";
import type { Bucket, Event } from "@/lib/types";

const BUCKET_LABELS: Record<Bucket, string> = {
  today: "Today",
  tomorrow: "Tomorrow",
  "this weekend": "This Weekend",
  "next weekend": "Next Weekend",
  upcoming: "Upcoming",
};

export function EventGroup({
  bucket,
  events,
}: {
  bucket: Bucket;
  events: Event[];
}) {
  return (
    <section>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {BUCKET_LABELS[bucket]}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {events.length} {events.length === 1 ? "show" : "shows"}
          </span>
        </h2>
        <Separator className="mt-2" />
      </div>
      <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </div>
    </section>
  );
}
