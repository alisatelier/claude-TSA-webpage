import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import SearchInput from "../components/ui/SearchInput";

const PER_PAGE = 20;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const params = await searchParams;
  const q = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where = q
    ? { email: { contains: q, mode: "insensitive" as const } }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { loyalty: { select: { currentCredits: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const currentParams: Record<string, string> = {};
  if (q) currentParams.q = q;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users</h1>

      <div className="mb-4">
        <SearchInput placeholder="Search by email..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Credits
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-slate-700 hover:underline"
                    >
                      {user.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge status={user.role} />
                  </td>
                  <td className="px-4 py-3">{user.loyalty?.currentCredits ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.createdAt.toLocaleDateString()}
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
        baseUrl="/admin/users"
        searchParams={currentParams}
      />
    </div>
  );
}
