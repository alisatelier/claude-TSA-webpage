import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "../../components/ui/Badge";
import CreditAdjustForm from "./CreditAdjustForm";
import DeleteUserButton from "./DeleteUserButton";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      wishlistItems: true,
      ritualCreditLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">User Detail</h1>
        <DeleteUserButton userId={user.id} userEmail={user.email} />
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium">{user.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Role</dt>
            <dd>
              <Badge status={user.role} />
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Ritual Credits</dt>
            <dd className="font-medium">{user.ritualCredits}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Joined</dt>
            <dd>{user.createdAt.toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      {/* Credit Adjustment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Adjust Ritual Credits
        </h2>
        <CreditAdjustForm userId={user.id} />
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Order History
        </h2>
        {user.orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 font-medium text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Total
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-2">
                    <Badge status={order.status} />
                  </td>
                  <td className="py-2">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </td>
                  <td className="py-2 text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Wishlist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Wishlist Items
        </h2>
        {user.wishlistItems.length === 0 ? (
          <p className="text-sm text-gray-500">No wishlist items</p>
        ) : (
          <ul className="text-sm space-y-1">
            {user.wishlistItems.map((item) => (
              <li key={item.id} className="text-gray-700">
                Product: {item.productId}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Credit Log */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Ritual Credit Ledger
        </h2>
        {user.ritualCreditLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No credit adjustments</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.ritualCreditLogs.map((log) => (
                <tr key={log.id}>
                  <td
                    className={`py-2 font-medium ${log.amount > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {log.amount > 0 ? "+" : ""}
                    {log.amount}
                  </td>
                  <td className="py-2 text-gray-700">{log.reason}</td>
                  <td className="py-2 text-gray-500">
                    {log.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
