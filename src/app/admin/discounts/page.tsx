import { prisma } from "@/lib/prisma";
import DiscountCodeForm from "./DiscountCodeForm";
import DiscountCodeRow from "./DiscountCodeRow";

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>

      <DiscountCodeForm />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {codes.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No discount codes yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Used</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Per Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {codes.map((dc) => (
                  <DiscountCodeRow
                    key={dc.id}
                    id={dc.id}
                    code={dc.code}
                    type={dc.type}
                    value={dc.value}
                    usedCount={dc.usedCount}
                    maxUses={dc.maxUses}
                    maxUsesPerCustomer={dc.maxUsesPerCustomer}
                    active={dc.active}
                    expiresAt={dc.expiresAt?.toISOString() ?? null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
