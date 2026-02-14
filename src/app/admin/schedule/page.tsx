import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WeeklyScheduleEditor from "./WeeklyScheduleEditor";
import DateBlockList from "./DateBlockList";

export default async function AdminSchedulePage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const allBlocks = await prisma.scheduleBlock.findMany({
    orderBy: { createdAt: "desc" },
  });

  const recurringBlocks = allBlocks
    .filter((b) => b.isRecurring)
    .map((b) => ({
      id: b.id,
      dayOfWeek: b.dayOfWeek!,
      time: b.time,
    }));

  const dateBlocks = allBlocks
    .filter((b) => !b.isRecurring)
    .map((b) => ({
      id: b.id,
      date: b.date,
      time: b.time,
      reason: b.reason,
    }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Schedule Settings</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Schedule</h2>
        <p className="text-sm text-gray-500 mb-4">
          Toggle days or individual time slots on/off. Turning a full day off blocks all slots for that day.
        </p>
        <WeeklyScheduleEditor blocks={recurringBlocks} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Date-Specific Blocks</h2>
        <p className="text-sm text-gray-500 mb-4">
          Block specific dates or time slots. These override the weekly schedule.
        </p>
        <DateBlockList blocks={dateBlocks} />
      </div>
    </div>
  );
}
