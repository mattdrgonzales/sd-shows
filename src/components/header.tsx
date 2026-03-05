"use client";

import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type DateQuickPick = "today" | "tomorrow" | "weekend" | null;

interface HeaderProps {
  count: number;
  dateQuick: DateQuickPick;
  dateSpecific: Date | undefined;
  calendarOpen: boolean;
  searchQuery: string;
  hasFilters: boolean;
  onQuickPick: (pick: DateQuickPick) => void;
  onCalendarSelect: (day: Date | undefined) => void;
  onCalendarOpenChange: (open: boolean) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const QUICK_PICKS: { value: DateQuickPick; label: string }[] = [
  { value: "today", label: "TODAY" },
  { value: "tomorrow", label: "TMRW" },
  { value: "weekend", label: "WKND" },
];

export function Header({
  count,
  dateQuick,
  dateSpecific,
  calendarOpen,
  searchQuery,
  hasFilters,
  onQuickPick,
  onCalendarSelect,
  onCalendarOpenChange,
  onSearchChange,
  onClearFilters,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-[#0A0A0A]/85 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {/* Top row: brand + filters + count */}
      <div className="flex items-center justify-between gap-4 pt-4 pb-3">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            SD SHOWS
          </h1>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:inline">
            Live music in San Diego
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {QUICK_PICKS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onQuickPick(value)}
              className={`cursor-pointer px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150 ${
                dateQuick === value
                  ? "bg-accent-steel text-white"
                  : "border border-border text-muted-foreground hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}

          <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
            <PopoverTrigger asChild>
              <button
                className={`cursor-pointer p-1.5 transition-colors duration-150 ${
                  dateSpecific
                    ? "bg-accent-steel text-white"
                    : "border border-border text-muted-foreground hover:border-[rgba(255,255,255,0.15)] hover:text-foreground"
                }`}
              >
                <CalendarIcon className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-border bg-[#1A1A1A] p-0" align="end">
              <Calendar
                mode="single"
                selected={dateSpecific}
                onSelect={onCalendarSelect}
                defaultMonth={dateSpecific ?? new Date()}
              />
            </PopoverContent>
          </Popover>

          {dateSpecific && (
            <span className="ml-1 text-[10px] font-medium text-accent-steel">
              {format(dateSpecific, "MMM d")}
            </span>
          )}

          <span className="ml-2 text-xs tabular-nums text-muted-foreground">
            {count}
          </span>
        </div>
      </div>

      {/* Search row */}
      <div className="relative pb-3">
        <Search className="absolute top-1/2 left-0 size-3.5 -translate-y-1/2 pb-3 text-muted-foreground" style={{ paddingBottom: '12px' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search artist or venue..."
          className="w-full border-0 border-b border-border bg-transparent py-1.5 pl-5 pr-8 text-sm text-foreground placeholder:text-[#444444] focus:border-accent-steel focus:outline-none"
        />
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground transition-colors hover:text-foreground"
            style={{ paddingBottom: '12px' }}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
