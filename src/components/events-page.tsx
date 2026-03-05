"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { EventGroup } from "@/components/event-group";
import { Footer } from "@/components/footer";
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
  return [sat.toLocaleDateString("en-CA"), sun.toLocaleDateString("en-CA")];
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
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuick, setDateQuick] = useState<DateQuickPick>(null);
  const [dateSpecific, setDateSpecific] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const hasFilters = searchQuery !== "" || dateQuick !== null || dateSpecific !== undefined;

  function clearFilters() {
    setSearchQuery("");
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
    const query = searchQuery.toLowerCase().trim();
    return events.filter((e) => {
      if (query) {
        const matchesArtist = e.artist.toLowerCase().includes(query);
        const matchesVenue = e.venue.toLowerCase().includes(query);
        if (!matchesArtist && !matchesVenue) return false;
      }

      if (dateQuick === "today" && e.date !== getTodayStr()) return false;
      if (dateQuick === "tomorrow" && e.date !== getTomorrowStr()) return false;
      if (dateQuick === "weekend" && !getWeekendDates().includes(e.date)) return false;

      if (dateSpecific) {
        const specific = dateSpecific.toLocaleDateString("en-CA");
        if (e.date !== specific) return false;
      }

      return true;
    });
  }, [events, searchQuery, dateQuick, dateSpecific]);

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Header
        count={filtered.length}
        dateQuick={dateQuick}
        dateSpecific={dateSpecific}
        calendarOpen={calendarOpen}
        searchQuery={searchQuery}
        hasFilters={hasFilters}
        onQuickPick={handleQuickPick}
        onCalendarSelect={handleCalendarSelect}
        onCalendarOpenChange={setCalendarOpen}
        onSearchChange={setSearchQuery}
        onClearFilters={clearFilters}
      />

      <div className="mt-8 space-y-12">
        {grouped.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-bold tracking-tight">NO SHOWS MATCH.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different date or clear your filters.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 cursor-pointer border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors duration-150 hover:border-foreground hover:text-foreground"
              >
                CLEAR FILTERS
              </button>
            )}
          </div>
        ) : (
          grouped.map(({ bucket, events }) => (
            <EventGroup key={bucket} bucket={bucket} events={events} />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
