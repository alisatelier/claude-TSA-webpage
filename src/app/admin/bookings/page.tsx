import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import BookingStatusSelect from "./BookingStatusSelect";

const PER_PAGE = 20;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const params = await searchParams;
  const statusFilter = params.status as BookingStatus | undefined;
  const fromDate = params.from ?? "";
  const toDate = params.to ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const today = new Date().toISOString().split("T")[0];

  const where: Record<string, unknown> = {};
  if (statusFilter && Object.values(BookingStatus).includes(statusFilter)) {
    where.status = statusFilter;
  }
  if (fromDate || toDate) {
    where.selectedDate = {};
    if (fromDate)
      (where.selectedDate as Record<string, string>).gte = fromDate;
    if (toDate) (where.selectedDate as Record<string, string>).lte = toDate;
  } else {
    where.selectedDate = { gte: today };
  }

  const [bookings, total] = await Promise.all([
    prisma.serviceBooking.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { selectedDate: "asc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.serviceBooking.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const currentParams: Record<string, string> = {};
  if (statusFilter) currentParams.status = statusFilter;
  if (fromDate) currentParams.from = fromDate;
  if (toDate) currentParams.to = toDate;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bookings</h1>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <StatusFilter current={statusFilter} />
        <form className="flex items-center gap-2 text-sm">
          <label className="text-gray-600">From:</label>
          <input
            type="date"
            name="from"
            defaultValue={fromDate}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <label className="text-gray-600">To:</label>
          <input
            type="date"
            name="to"
            defaultValue={toDate}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-slate-800 text-white rounded text-sm hover:bg-slate-700"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Service
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Time
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{booking.serviceId}</td>
                  <td className="px-4 py-3">{booking.selectedDate}</td>
                  <td className="px-4 py-3">{booking.selectedTime}</td>
                  <td className="px-4 py-3">
                    {booking.user?.name ?? booking.userName}
                  </td>
                  <td className="px-4 py-3">
                    {booking.user?.email ?? booking.userEmail}
                  </td>
                  <td className="px-4 py-3">
                    <BookingStatusSelect
                      bookingId={booking.id}
                      currentStatus={booking.status}
                    />
                  </td>
                  <td className="px-4 py-3">
                    ${booking.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/bookings"
        searchParams={currentParams}
      />
    </div>
  );
}

function StatusFilter({ current }: { current?: string }) {
  const statuses = Object.values(BookingStatus);
  return (
    <div className="flex items-center gap-1">
      <a
        href="/admin/bookings"
        className={`px-2 py-1 text-xs rounded ${!current ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
      >
        All
      </a>
      {statuses.map((s) => (
        <a
          key={s}
          href={`/admin/bookings?status=${s}`}
          className={`px-2 py-1 text-xs rounded ${current === s ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {s}
        </a>
      ))}
    </div>
  );
}
