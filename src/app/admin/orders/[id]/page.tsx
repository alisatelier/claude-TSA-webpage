import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatOrderNumber, resolveProduct } from "@/lib/order-utils";
import Badge from "../../components/ui/Badge";
import OrderDetailActions from "./OrderDetailActions";
import DetailTrackingInput from "./DetailTrackingInput";
import OrderPdfButton from "./OrderPdfButton";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
    },
  });

  if (!order) notFound();

  const resolvedItems = order.items.map((item) => {
    // Use stored data if available; fall back to resolveProduct for pre-migration orders
    if (item.name) {
      return {
        ...item,
        image: item.image || resolveProduct(item.productId).image,
        isService: false,
      };
    }
    return {
      ...item,
      ...resolveProduct(item.productId),
    };
  });

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          &larr; Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {formatOrderNumber(order.orderNumber)}
            </h1>
            <Badge status={order.status} />
          </div>
          <div className="flex items-center gap-2">
            <OrderPdfButton
              order={{
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                refundAmount: order.refundAmount,
                trackingNumber: order.trackingNumber,
                createdAt: order.createdAt.toISOString(),
                customer: { name: order.user.name ?? "", email: order.user.email },
                items: resolvedItems.map((item) => ({
                  name: item.name,
                  variation: item.variation ?? null,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                })),
              }}
            />
            <OrderDetailActions
              orderId={order.id}
              currentStatus={order.status}
              totalAmount={order.totalAmount}
              refundAmount={order.refundAmount}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Order Information
        </h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Customer</dt>
            <dd className="font-medium">
              <Link
                href={`/admin/users/${order.user.id}`}
                className="text-slate-700 hover:text-slate-900 underline"
              >
                {order.user.name ?? "—"}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{order.user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Total</dt>
            <dd className="font-medium">
              ${(order.totalAmount / 100).toFixed(2)}
            </dd>
          </div>
          {order.refundAmount > 0 && (
            <>
              <div>
                <dt className="text-gray-500">Refunded</dt>
                <dd className="font-medium text-amber-700">
                  -${(order.refundAmount / 100).toFixed(2)}{" "}
                  ({Math.round((order.refundAmount / order.totalAmount) * 100)}%)
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Net Total</dt>
                <dd className="font-medium">
                  ${((order.totalAmount - order.refundAmount) / 100).toFixed(2)}
                </dd>
              </div>
            </>
          )}
          <div>
            <dt className="text-gray-500">Date</dt>
            <dd>{order.createdAt.toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      {/* Tracking Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Tracking Number
        </h2>
        <DetailTrackingInput
          orderId={order.id}
          currentTracking={order.trackingNumber ?? ""}
        />
      </div>

      {/* Items Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Items ({resolvedItems.length})
        </h2>
        <div className="divide-y divide-gray-100">
          {resolvedItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover bg-gray-100"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  N/A
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                {item.variation && (
                  <p className="text-xs text-indigo-600">{item.variation}</p>
                )}
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity}
                  {item.unitPrice > 0 && (
                    <> &middot; ${(item.unitPrice / 100).toFixed(2)} each</>
                  )}
                </p>
              </div>
              {item.isService && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  Service
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
