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

  await prisma.blogPost.create({ data });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
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
  revalidatePath("/blog");
  return {};
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAdmin();

  if (featured) {
    await prisma.blogPost.updateMany({ where: { featured: true }, data: { featured: false } });
  }

  await prisma.blogPost.update({ where: { id }, data: { featured } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}
