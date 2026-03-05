import Image from "next/image";
import { Music, MapPin, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MusicLinks } from "@/components/music-links";
import { VENUE_INFO } from "@/lib/venues";
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

function ArtistInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      {initials ? (
        <span className="text-lg font-semibold text-muted-foreground">
          {initials}
        </span>
      ) : (
        <Music className="size-6 text-muted-foreground" />
      )}
    </div>
  );
}

export function EventCard({ event }: { event: Event }) {
  const venueInfo = VENUE_INFO[event.venue];

  return (
    <Card className="gap-0 py-0 overflow-hidden transition-colors hover:border-primary/30">
      <CardContent className="flex gap-0 p-0">
        {/* Artist image */}
        <div className="relative size-20 shrink-0 sm:size-24">
          {event.artist_image ? (
            <Image
              src={event.artist_image}
              alt={event.artist}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <ArtistInitials name={event.artist} />
          )}
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-base font-semibold leading-tight">
                {event.artist}
              </h3>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {formatDate(event.date)}
              </Badge>
            </div>
            <a
              href={venueInfo?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {event.venue}
            </a>
            {venueInfo && (
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground/70">
                <MapPin className="size-3 shrink-0" />
                {venueInfo.address}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <MusicLinks artist={event.artist} />
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Ticket className="size-3.5" />
                Tickets
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
