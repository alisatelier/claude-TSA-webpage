import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatOrderNumber, resolveProduct } from "@/lib/order-utils";
import Badge from "../../components/ui/Badge";
import CreditAdjustForm from "./CreditAdjustForm";
import DeleteUserButton from "./DeleteUserButton";

export const dynamic = "force-dynamic";

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
      loyalty: true,
      transactionLog: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
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
            <dt className="text-gray-500">Current Credits</dt>
            <dd className="font-medium">
              {user.loyalty?.currentCredits ?? 0}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Lifetime Credits</dt>
            <dd className="font-medium">
              {user.loyalty?.lifetimeCredits ?? 0}
            </dd>
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
                  Order #
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
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-slate-700 hover:text-slate-900 underline"
                    >
                      {formatOrderNumber(order.orderNumber)}
                    </Link>
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
          Wishlist Items ({user.wishlistItems.length})
        </h2>
        {user.wishlistItems.length === 0 ? (
          <p className="text-sm text-gray-500">No wishlist items</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {user.wishlistItems.map((item) => {
              const resolved = resolveProduct(item.productId, item.variation || undefined);
              return (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  {resolved.image ? (
                    <img
                      src={resolved.image}
                      alt={resolved.name}
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      N/A
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {resolved.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">{item.productId}</p>
                      {item.variation && (
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                          {item.variation}
                        </span>
                      )}
                    </div>
                  </div>
                  {resolved.isService && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      Service
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credit Log */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Credit History
        </h2>
        {user.transactionLog.length === 0 ? (
          <p className="text-sm text-gray-500">No credit activity</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Action
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Balance
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.transactionLog.map((log) => (
                <tr key={log.id}>
                  <td
                    className={`py-2 font-medium ${log.credits > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {log.credits > 0 ? "+" : ""}
                    {log.credits}
                  </td>
                  <td className="py-2 text-gray-700">{log.action}</td>
                  <td className="py-2 text-gray-500">{log.runningBalance}</td>
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
