import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "./components/ui/StatCard";

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ordersThisMonth, revenueResult, activeBookings, creditsResult] =
    await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: firstOfMonth } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: firstOfMonth } },
        _sum: { totalAmount: true },
      }),
      prisma.serviceBooking.count({
        where: { status: { in: ["CONFIRMED", "HELD"] } },
      }),
      prisma.ritualCreditLog.aggregate({
        where: { amount: { gt: 0 } },
        _sum: { amount: true },
      }),
    ]);

  const revenue = revenueResult._sum.totalAmount ?? 0;
  const totalCreditsIssued = creditsResult._sum.amount ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Orders This Month" value={ordersThisMonth} />
        <StatCard
          label="Revenue This Month"
          value={`$${(revenue / 100).toFixed(2)}`}
        />
        <StatCard label="Active Bookings" value={activeBookings} />
        <StatCard label="Total Credits Issued" value={totalCreditsIssued} />
      </div>
    </div>
  );
}
