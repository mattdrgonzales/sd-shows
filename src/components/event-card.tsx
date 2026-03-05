"use client";

import Image from "next/image";
import { Music, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { MusicLinks } from "@/components/music-links";
import { VENUE_INFO } from "@/lib/venues";
import type { Event } from "@/lib/types";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year!, month! - 1, day));
  return d
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}

function ArtistInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#111111]">
      {initials ? (
        <span className="font-display text-3xl font-bold text-[#333333]">
          {initials}
        </span>
      ) : (
        <Music className="size-8 text-[#333333]" />
      )}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function EventCard({ event, index }: { event: Event; index: number }) {
  const venueInfo = VENUE_INFO[event.venue];

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(index * 0.06, 0.36) }}
      whileHover={{ y: -2 }}
      className="group cursor-default"
    >
      {/* Artist image — portrait ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111111]">
        {event.artist_image ? (
          <Image
            src={event.artist_image}
            alt={event.artist}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <ArtistInitials name={event.artist} />
        )}
      </div>

      {/* Info */}
      <div className="pt-2 pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-tobacco">
          {formatDate(event.date)}
        </p>
        <h3 className="mt-0.5 truncate font-display text-sm font-bold leading-tight tracking-tight">
          {event.artist}
        </h3>
        <a
          href={venueInfo?.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 block truncate text-xs text-muted-foreground transition-colors duration-150 hover:text-accent-steel"
        >
          {event.venue}
        </a>
        <div className="mt-1.5 flex items-center justify-between">
          <MusicLinks artist={event.artist} />
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-accent-moss px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white transition-colors duration-150 hover:bg-[#5a9470]"
            >
              <Ticket className="size-3" />
              TIX
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
