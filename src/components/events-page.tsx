"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventGroup } from "@/components/event-group";
import { Header } from "@/components/header";
import type { Bucket, Event } from "@/lib/types";
import { BUCKET_ORDER } from "@/lib/types";

export function EventsPage({
  events,
  venues,
}: {
  events: Event[];
  venues: string[];
}) {
  const [search, setSearch] = useState("");
  const [venue, setVenue] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return events.filter((e) => {
      if (q && !e.artist.toLowerCase().includes(q)) return false;
      if (venue !== "all" && e.venue !== venue) return false;
      return true;
    });
  }, [events, search, venue]);

  const grouped = useMemo(() => {
    const map = new Map<Bucket, Event[]>();
    for (const event of filtered) {
      const list = map.get(event.bucket) ?? [];
      list.push(event);
      map.set(event.bucket, list);
    }
    return BUCKET_ORDER.filter((b) => map.has(b)).map((b) => ({
      bucket: b,
      events: map.get(b)!,
    }));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Header />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={venue} onValueChange={setVenue}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="All venues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All venues</SelectItem>
            {venues.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6 space-y-6">
        {grouped.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No shows found.
          </p>
        ) : (
          grouped.map(({ bucket, events }) => (
            <EventGroup key={bucket} bucket={bucket} events={events} />
          ))
        )}
      </div>
    </div>
  );
}
