import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { services } from "@/lib/data";

const TIMEZONE = "America/Edmonton";

function getCalendarClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientId || !clientSecret || !refreshToken || !calendarId) {
    return null;
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });

  return google.calendar({ version: "v3", auth: oauth2 });
}

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 60;
}

function parseDateTime(date: string, time: string): Date {
  // date: "2026-02-20", time: "2:00 PM"
  const [timePart, meridiem] = time.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (meridiem?.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === "AM" && hour === 12) hour = 0;

  const [year, month, day] = date.split("-").map(Number);
  const dt = new Date(year, month - 1, day, hour, minute, 0);
  return dt;
}

function toRFC3339(dt: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
}

export async function deleteCalendarEvent(
  googleCalendarEventId: string,
): Promise<void> {
  try {
    const calendar = getCalendarClient();
    if (!calendar) {
      console.warn("[google-calendar] Missing credentials, skipping event deletion");
      return;
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID!;

    await calendar.events.delete({
      calendarId,
      eventId: googleCalendarEventId,
    });

    console.log("[google-calendar] Event deleted:", googleCalendarEventId);
  } catch (err) {
    console.error("[google-calendar] Failed to delete event:", err);
  }
}

export async function createCalendarEvent(bookingId: string): Promise<void> {
  try {
    const calendar = getCalendarClient();
    if (!calendar) {
      console.warn("[google-calendar] Missing credentials, skipping event creation");
      return;
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      console.error("[google-calendar] Booking not found:", bookingId);
      return;
    }

    const service = services.find((s) => s.id === booking.serviceId);
    const serviceName = service?.name ?? booking.serviceId;
    const durationMinutes = parseDurationMinutes(service?.duration ?? "60 Minutes");

    const startDt = parseDateTime(booking.selectedDate, booking.selectedTime);
    const endDt = new Date(startDt.getTime() + durationMinutes * 60 * 1000);

    const description = [
      `Client: ${booking.userName}`,
      `Email: ${booking.userEmail}`,
      booking.userNotes ? `Notes: ${booking.userNotes}` : "",
      booking.addOn ? `Add-on: Yes` : "",
      `Price: $${booking.totalPrice.toFixed(2)}`,
    ]
      .filter(Boolean)
      .join("\n");

    const calendarId = process.env.GOOGLE_CALENDAR_ID!;

    const event = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      requestBody: {
        summary: serviceName,
        description,
        start: {
          dateTime: toRFC3339(startDt),
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: toRFC3339(endDt),
          timeZone: TIMEZONE,
        },
        attendees: [{ email: booking.userEmail }],
        conferenceData: {
          createRequest: {
            requestId: bookingId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const meetLink =
      event.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri ?? null;

    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: {
        googleCalendarEventId: event.data.id ?? undefined,
        googleMeetLink: meetLink,
      },
    });

    console.log(
      "[google-calendar] Event created:",
      event.data.id,
      "Meet:",
      meetLink
    );
  } catch (err) {
    console.error("[google-calendar] Failed to create event:", err);
  }
}
