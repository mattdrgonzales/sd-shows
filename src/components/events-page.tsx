"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { EventGroup } from "@/components/event-group";
import { Header } from "@/components/header";
import type { Bucket, Event } from "@/lib/types";
import { BUCKET_ORDER } from "@/lib/types";

type DateQuickPick = "today" | "tomorrow" | "weekend" | null;

function getTodayStr(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

function getWeekendDates(): string[] {
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const dow = today.getDay();
  const daysToSat = dow === 0 ? 6 : 6 - dow;
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return [
    sat.toLocaleDateString("en-CA"),
    sun.toLocaleDateString("en-CA"),
  ];
}

export function EventsPage({
  events,
  venues,
  artists,
}: {
  events: Event[];
  venues: string[];
  artists: string[];
}) {
  const [artistImages, setArtistImages] = useState<Record<string, string | null>>({});
  const [artist, setArtist] = useState("all");
  const [venue, setVenue] = useState("all");
  const [dateQuick, setDateQuick] = useState<DateQuickPick>(null);
  const [dateSpecific, setDateSpecific] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fetch artist images client-side
  useEffect(() => {
    if (!artists.length) return;
    fetch("/api/artist-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artists }),
    })
      .then((r) => r.ok ? r.json() : {})
      .then(setArtistImages)
      .catch(() => {});
  }, [artists]);

  // Merge images into events
  const eventsWithImages = useMemo(() => {
    if (!Object.keys(artistImages).length) return events;
    return events.map((e) => ({
      ...e,
      artist_image: artistImages[e.artist] ?? e.artist_image,
    }));
  }, [events, artistImages]);

  const hasFilters = artist !== "all" || venue !== "all" || dateQuick !== null || dateSpecific !== undefined;

  function clearFilters() {
    setArtist("all");
    setVenue("all");
    setDateQuick(null);
    setDateSpecific(undefined);
  }

  function handleQuickPick(pick: DateQuickPick) {
    setDateSpecific(undefined);
    setDateQuick(dateQuick === pick ? null : pick);
  }

  function handleCalendarSelect(day: Date | undefined) {
    setDateQuick(null);
    setDateSpecific(day);
    setCalendarOpen(false);
  }

  const filtered = useMemo(() => {
    return eventsWithImages.filter((e) => {
      if (artist !== "all" && e.artist !== artist) return false;
      if (venue !== "all" && e.venue !== venue) return false;

      if (dateQuick === "today" && e.date !== getTodayStr()) return false;
      if (dateQuick === "tomorrow" && e.date !== getTomorrowStr()) return false;
      if (dateQuick === "weekend" && !getWeekendDates().includes(e.date)) return false;

      if (dateSpecific) {
        const specific = dateSpecific.toLocaleDateString("en-CA");
        if (e.date !== specific) return false;
      }

      return true;
    });
  }, [eventsWithImages, artist, venue, dateQuick, dateSpecific]);

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

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Dropdowns row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={artist} onValueChange={setArtist}>
            <SelectTrigger className="sm:flex-1">
              <SelectValue placeholder="All artists" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All artists</SelectItem>
              {artists.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={venue} onValueChange={setVenue}>
            <SelectTrigger className="sm:flex-1">
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

        {/* Date filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={dateQuick === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickPick("today")}
          >
            Today
          </Button>
          <Button
            variant={dateQuick === "tomorrow" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickPick("tomorrow")}
          >
            Tomorrow
          </Button>
          <Button
            variant={dateQuick === "weekend" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickPick("weekend")}
          >
            Weekend
          </Button>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={dateSpecific ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
              >
                <CalendarIcon className="size-4" />
                {dateSpecific ? format(dateSpecific, "MMM d") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateSpecific}
                onSelect={handleCalendarSelect}
                defaultMonth={dateSpecific ?? new Date()}
              />
            </PopoverContent>
          </Popover>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground"
            >
              <X className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Events */}
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
