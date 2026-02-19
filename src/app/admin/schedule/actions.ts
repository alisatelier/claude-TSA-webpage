"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getScheduleSettings() {
  const settings = await prisma.scheduleSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  return {
    leadTimeDays: settings.leadTimeDays,
    maxRangeDays: settings.maxRangeDays,
    maxBookingsPerWeek: settings.maxBookingsPerWeek,
  };
}

export async function updateScheduleSettings(
  leadTimeDays: number,
  maxRangeDays: number,
  maxBookingsPerWeek: number,
) {
  await requireAdmin();

  if (leadTimeDays < 0 || maxRangeDays < 1 || maxBookingsPerWeek < 1) {
    throw new Error("Invalid settings");
  }

  await prisma.scheduleSettings.upsert({
    where: { id: "default" },
    update: { leadTimeDays, maxRangeDays, maxBookingsPerWeek },
    create: { id: "default", leadTimeDays, maxRangeDays, maxBookingsPerWeek },
  });

  revalidatePath("/admin/schedule");
}

export async function toggleRecurringBlock(
  dayOfWeek: number,
  time: string | null
) {
  await requireAdmin();

  if (time === null) {
    // Toggling full-day block
    const existing = await prisma.scheduleBlock.findFirst({
      where: { isRecurring: true, dayOfWeek, time: null },
    });

    if (existing) {
      // Remove full-day block
      await prisma.scheduleBlock.delete({ where: { id: existing.id } });
    } else {
      // Add full-day block and remove individual slot blocks for this day
      await prisma.scheduleBlock.deleteMany({
        where: { isRecurring: true, dayOfWeek },
      });
      await prisma.scheduleBlock.create({
        data: { isRecurring: true, dayOfWeek, time: null },
      });
    }
  } else {
    // Toggling individual slot block
    const existing = await prisma.scheduleBlock.findFirst({
      where: { isRecurring: true, dayOfWeek, time },
    });

    if (existing) {
      await prisma.scheduleBlock.delete({ where: { id: existing.id } });
    } else {
      await prisma.scheduleBlock.create({
        data: { isRecurring: true, dayOfWeek, time },
      });
    }
  }

  revalidatePath("/admin/schedule");
}

export async function addDateBlock(
  date: string,
  time: string | null,
  reason: string | null
) {
  await requireAdmin();

  // Check if already exists
  const existing = await prisma.scheduleBlock.findFirst({
    where: { isRecurring: false, date, time },
  });

  if (existing) return;

  if (time === null) {
    // Full day block — remove any individual slot blocks for this date
    await prisma.scheduleBlock.deleteMany({
      where: { isRecurring: false, date },
    });
  }

  await prisma.scheduleBlock.create({
    data: { isRecurring: false, date, time, reason },
  });

  revalidatePath("/admin/schedule");
}

export async function removeDateBlock(blockId: string) {
  await requireAdmin();

  await prisma.scheduleBlock.delete({ where: { id: blockId } });

  revalidatePath("/admin/schedule");
}
