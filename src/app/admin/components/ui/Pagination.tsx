import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${baseUrl}?${params.toString()}`;
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Previous
        </Link>
      ) : (
        <span className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-400">
          Previous
        </span>
      )}
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Next
        </Link>
      ) : (
        <span className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-400">
          Next
        </span>
      )}
    </div>
  );
}
