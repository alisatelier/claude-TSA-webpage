import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/data";
import Pagination from "../components/ui/Pagination";
import ReviewActions from "./ReviewActions";

const PER_PAGE = 20;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const params = await searchParams;
  const filter = params.filter ?? "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where: Record<string, unknown> = {};
  if (filter === "pending") where.approved = false;
  if (filter === "approved") where.approved = true;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.review.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const pendingCount = await prisma.review.count({ where: { approved: false } });

  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  const currentParams: Record<string, string> = {};
  if (filter !== "all") currentParams.filter = filter;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        {pendingCount > 0 && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 mb-4">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
        ].map((tab) => (
          <a
            key={tab.key}
            href={tab.key === "all" ? "/admin/reviews" : `/admin/reviews?filter=${tab.key}`}
            className={`px-2 py-1 text-xs rounded ${
              filter === tab.key
                ? "bg-slate-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 max-w-xs">Review</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 align-top">
                  <td className="px-4 py-3">
                    {productMap[review.productId] ?? review.productId}
                  </td>
                  <td className="px-4 py-3">
                    <div>{review.user.name ?? "Anonymous"}</div>
                    <div className="text-xs text-gray-400">{review.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="line-clamp-3 text-gray-700">{review.text}</p>
                    {review.adminResponse && (
                      <p className="mt-1 text-xs text-gray-500 italic">
                        Response: {review.adminResponse.slice(0, 60)}
                        {review.adminResponse.length > 60 ? "..." : ""}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        review.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ReviewActions
                      reviewId={review.id}
                      isApproved={review.approved}
                      existingResponse={review.adminResponse}
                    />
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
        baseUrl="/admin/reviews"
        searchParams={currentParams}
      />
    </div>
  );
}
