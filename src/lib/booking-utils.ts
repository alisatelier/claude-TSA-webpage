/**
 * Shared booking date/time utilities.
 * The parse logic mirrors the private `parseDateTime` in google-calendar.ts.
 */

export function parseBookingDateTime(date: string, time: string): Date {
  const [timePart, meridiem] = time.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (meridiem?.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === "AM" && hour === 12) hour = 0;

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0);
}

export function isWithin24Hours(date: string, time: string): boolean {
  const bookingDt = parseBookingDateTime(date, time);
  const now = new Date();
  return bookingDt.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
}
