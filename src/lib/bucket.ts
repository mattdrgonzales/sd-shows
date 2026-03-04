export type Bucket =
  | "past"
  | "today"
  | "tomorrow"
  | "this weekend"
  | "next weekend"
  | "upcoming";

const TZ = "America/Los_Angeles";

/** Get today's date in LA timezone as YYYY-MM-DD */
export function getTodayLA(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Parse YYYY-MM-DD to Date object at midnight UTC */
function parseDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Get day of week (0=Sunday, 6=Saturday) */
function getDayOfWeek(dateStr: string): number {
  return parseDate(dateStr).getUTCDay();
}

/** Add days to a date string, return YYYY-MM-DD */
function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0] as string;
}

/** Get the Saturday of the current week */
function getThisWeekendSaturday(today: string): string {
  const dow = getDayOfWeek(today);
  if (dow === 6) return today;
  if (dow === 0) return addDays(today, 6);
  return addDays(today, 6 - dow);
}

/**
 * Compute bucket for an event date relative to today in America/Los_Angeles.
 *
 * - past: date < today
 * - today: date == today
 * - tomorrow: date == today + 1
 * - this weekend: date is Saturday or Sunday of current week
 * - next weekend: date is Saturday or Sunday of following week
 * - upcoming: everything else in the future
 */
export function computeBucket(eventDate: string, today?: string): Bucket {
  const todayStr = today ?? getTodayLA();

  if (eventDate < todayStr) return "past";
  if (eventDate === todayStr) return "today";

  const tomorrow = addDays(todayStr, 1);
  if (eventDate === tomorrow) return "tomorrow";

  const thisWeekSat = getThisWeekendSaturday(todayStr);
  const thisWeekSun = addDays(thisWeekSat, 1);
  if (eventDate === thisWeekSat || eventDate === thisWeekSun) return "this weekend";

  const nextWeekSat = addDays(thisWeekSat, 7);
  const nextWeekSun = addDays(nextWeekSat, 1);
  if (eventDate === nextWeekSat || eventDate === nextWeekSun) return "next weekend";

  return "upcoming";
}
