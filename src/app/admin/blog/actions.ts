"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createBlogPost(data: {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  featured: boolean;
}) {
  await requireAdmin();

  if (!data.title.trim() || !data.slug.trim() || !data.category.trim() || !data.excerpt.trim()) {
    return { error: "Title, slug, category, and excerpt are required" };
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "A post with this slug already exists" };
  }

  if (data.featured) {
    await prisma.blogPost.updateMany({ where: { featured: true }, data: { featured: false } });
  }

  // New posts go to the top of the list
  const topPost = await prisma.blogPost.findFirst({ orderBy: { sortOrder: "asc" } });
  const newSortOrder = topPost ? topPost.sortOrder - 1 : 0;

  await prisma.blogPost.create({ data: { ...data, sortOrder: newSortOrder } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
  return {};
}

export async function updateBlogPost(
  id: string,
  data: {
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    featured: boolean;
  }
) {
  await requireAdmin();

  if (!data.title.trim() || !data.slug.trim() || !data.category.trim() || !data.excerpt.trim()) {
    return { error: "Title, slug, category, and excerpt are required" };
  }

  const existing = await prisma.blogPost.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (existing) {
    return { error: "A different post with this slug already exists" };
  }

  if (data.featured) {
    await prisma.blogPost.updateMany({
      where: { featured: true, NOT: { id } },
      data: { featured: false },
    });
  }

  await prisma.blogPost.update({ where: { id }, data });

  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
  return {};
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
  return {};
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAdmin();

  if (featured) {
    await prisma.blogPost.updateMany({ where: { featured: true }, data: { featured: false } });
  }

  await prisma.blogPost.update({ where: { id }, data: { featured } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
  return {};
}

export async function moveBlogPost(id: string, direction: "up" | "down") {
  await requireAdmin();

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return { error: "Post not found" };

  // "up" means lower sortOrder (closer to top), "down" means higher
  const neighbor = await prisma.blogPost.findFirst({
    where: {
      sortOrder: direction === "up"
        ? { lt: post.sortOrder }
        : { gt: post.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });

  if (!neighbor) return {};

  // Swap sortOrder values
  await prisma.$transaction([
    prisma.blogPost.update({ where: { id: post.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.blogPost.update({ where: { id: neighbor.id }, data: { sortOrder: post.sortOrder } }),
  ]);

  revalidatePath("/admin/blog");
  revalidatePath("/blog", "layout");
  return {};
}
