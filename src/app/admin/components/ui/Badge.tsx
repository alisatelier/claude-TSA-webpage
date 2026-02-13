const colorMap: Record<string, string> = {
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  HELD: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  ADMIN: "bg-purple-100 text-purple-800",
  CUSTOMER: "bg-gray-100 text-gray-800",
};

export default function Badge({ status }: { status: string }) {
  const colors = colorMap[status] ?? "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors}`}
    >
      {status}
    </span>
  );
}
