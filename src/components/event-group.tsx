"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EventCard } from "@/components/event-card";
import type { Bucket, Event } from "@/lib/types";

const BUCKET_LABELS: Record<Bucket, string> = {
  today: "TODAY",
  tomorrow: "TOMORROW",
  "this weekend": "THIS WEEKEND",
  "next weekend": "NEXT WEEKEND",
  upcoming: "UPCOMING",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export function EventGroup({
  bucket,
  events,
}: {
  bucket: Bucket;
  events: Event[];
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref}>
      {/* Bucket header with rule line */}
      <div className="sticky top-[88px] z-10 flex items-center gap-3 bg-[#0A0A0A]/85 py-2 backdrop-blur-xl sm:top-[92px]">
        <h2 className="font-display text-sm font-bold tracking-wide text-foreground">
          {BUCKET_LABELS[bucket]}
        </h2>
        <span className="text-xs tabular-nums text-[#666666]">
          {events.length}
        </span>
        <div className="bucket-rule" />
      </div>

      {/* Card grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-2 gap-x-2 gap-y-6 pt-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {events.map((event, i) => (
          <EventCard key={event.event_id} event={event} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
