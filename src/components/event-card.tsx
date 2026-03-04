import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MusicLinks } from "@/components/music-links";
import type { Event } from "@/lib/types";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year!, month! - 1, day));
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="gap-0 py-0 overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold leading-tight">
              {event.artist}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {event.venue}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {formatDate(event.date)}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <MusicLinks artist={event.artist} />
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary hover:underline"
            >
              Tickets
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
