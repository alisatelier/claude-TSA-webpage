import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import BlogPostForm from "../BlogPostForm";

export default async function NewBlogPostPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
