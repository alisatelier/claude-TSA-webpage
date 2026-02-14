"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { triggerOrderShippedEmail } from "@/lib/email/trigger";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  if (status === "SHIPPED") {
    triggerOrderShippedEmail(orderId);
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateTrackingNumber(
  orderId: string,
  trackingNumber: string
) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { trackingNumber },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function refundOrder(orderId: string, refundAmountCents: number) {
  await requireAdmin();

  if (refundAmountCents <= 0) {
    throw new Error("Refund amount must be greater than zero");
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const remaining = order.totalAmount - order.refundAmount;
  if (refundAmountCents > remaining) {
    throw new Error(
      `Refund amount ($${(refundAmountCents / 100).toFixed(2)}) exceeds remaining refundable amount ($${(remaining / 100).toFixed(2)})`
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { refundAmount: { increment: refundAmountCents } },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function exportOrderCsv(filters?: {
  status?: OrderStatus;
  q?: string;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.q) {
    where.user = { email: { contains: filters.q, mode: "insensitive" } };
  }

  const orders = await prisma.order.findMany({
    where,
    include: { user: { select: { email: true } }, items: true },
    orderBy: { createdAt: "desc" },
  });

  const header = "Order #,Email,Status,Total,Refund,Tracking,Date";
  const rows = orders.map(
    (o) =>
      `${o.orderNumber},${o.user.email},${o.status},${(o.totalAmount / 100).toFixed(2)},${(o.refundAmount / 100).toFixed(2)},${o.trackingNumber ?? ""},${o.createdAt.toISOString()}`
  );
  return [header, ...rows].join("\n");
}
