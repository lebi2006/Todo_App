import { isToday as dfIsToday, isThisWeek as dfIsThisWeek, isWithinInterval } from "date-fns";

// Safe parser: handles Date | string | null
function parseDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null;
  return date instanceof Date ? date : new Date(date);
}

export function isToday(date: Date | string | null | undefined): boolean {
  const parsed = parseDate(date);
  return parsed ? dfIsToday(parsed) : false;
}

export function isThisWeek(date: Date | string | null | undefined): boolean {
  const parsed = parseDate(date);
  return parsed ? dfIsThisWeek(parsed, { weekStartsOn: 1 }) : false; // Monday as start
}

export function isWithinRange(
  date: Date | string | null | undefined,
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
): boolean {
  const parsed = parseDate(date);
  const parsedStart = parseDate(start);
  const parsedEnd = parseDate(end);

  if (!parsed || !parsedStart || !parsedEnd) return false;

  return isWithinInterval(parsed, { start: parsedStart, end: parsedEnd });
}
