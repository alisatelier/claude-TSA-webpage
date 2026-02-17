import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pagination from "../components/ui/Pagination";
import SearchInput from "../components/ui/SearchInput";
import BlogPostActions from "./BlogPostActions";

const PER_PAGE = 20;

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const params = await searchParams;
  const q = params.q ?? "";
  const categoryFilter = params.category;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where: Record<string, unknown> = {};
  if (categoryFilter) {
    where.category = categoryFilter;
  }
  if (q) {
    where.title = { contains: q, mode: "insensitive" };
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const currentParams: Record<string, string> = {};
  if (q) currentParams.q = q;
  if (categoryFilter) currentParams.category = categoryFilter;

  const categories = [
    "Rituals & Practices",
    "Divination Wisdom",
    "Cosmic Insights",
    "Seasonal Guides",
    "Community Stories",
    "Product Spotlights",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          New Post
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <SearchInput placeholder="Search by title..." />
        <div className="flex items-center gap-1">
          <a
            href="/admin/blog"
            className={`px-2 py-1 text-xs rounded ${!categoryFilter ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/admin/blog?category=${encodeURIComponent(cat)}`}
              className={`px-2 py-1 text-xs rounded ${categoryFilter === cat ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Featured</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No blog posts found
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-slate-700 hover:text-slate-900 underline font-medium"
                    >
                      {post.title}
                    </Link>
                    {!post.published && (
                      <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.category}</td>
                  <td className="px-4 py-3">
                    {post.featured && (
                      <span className="text-yellow-500" title="Featured">★</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {post.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <BlogPostActions
                      postId={post.id}
                      isFeatured={post.featured}
                      isFirst={index === 0 && page === 1}
                      isLast={index === posts.length - 1 && page === totalPages}
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
        baseUrl="/admin/blog"
        searchParams={currentParams}
      />
    </div>
  );
}
