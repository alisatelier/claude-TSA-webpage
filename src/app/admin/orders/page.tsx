import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";
import { formatOrderNumber } from "@/lib/order-utils";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import SearchInput from "../components/ui/SearchInput";
import OrderStatusSelect from "./OrderStatusSelect";
import TrackingInput from "./TrackingInput";
import ExportCsvButton from "./ExportCsvButton";

const PER_PAGE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const params = await searchParams;
  const q = params.q ?? "";
  const statusFilter = params.status as OrderStatus | undefined;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where: Record<string, unknown> = {};
  if (statusFilter && Object.values(OrderStatus).includes(statusFilter)) {
    where.status = statusFilter;
  }
  if (q) {
    where.user = { email: { contains: q, mode: "insensitive" } };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const currentParams: Record<string, string> = {};
  if (q) currentParams.q = q;
  if (statusFilter) currentParams.status = statusFilter;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <ExportCsvButton
          filters={{ q: q || undefined, status: statusFilter }}
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <SearchInput placeholder="Search by email..." />
        <StatusFilter current={statusFilter} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Order #
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Total
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Tracking
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-slate-700 hover:text-slate-900 underline"
                    >
                      {formatOrderNumber(order.orderNumber)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.user.email}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="px-4 py-3">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <TrackingInput
                      orderId={order.id}
                      currentTracking={order.trackingNumber ?? ""}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.createdAt.toLocaleDateString()}
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
        baseUrl="/admin/orders"
        searchParams={currentParams}
      />
    </div>
  );
}

function StatusFilter({ current }: { current?: string }) {
  const statuses = Object.values(OrderStatus);
  return (
    <div className="flex items-center gap-1">
      <a
        href="/admin/orders"
        className={`px-2 py-1 text-xs rounded ${!current ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
      >
        All
      </a>
      {statuses.map((s) => (
        <a
          key={s}
          href={`/admin/orders?status=${s}`}
          className={`px-2 py-1 text-xs rounded ${current === s ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {s}
        </a>
      ))}
    </div>
  );
}
