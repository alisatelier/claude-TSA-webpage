"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/lib/data";

export default function BlogPostPage() {
  const params = useParams();
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-navy mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-mauve hover:text-navy underline">Return to Journal</Link>
        </div>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <div className="bg-cream py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-mauve">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-navy transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-navy">{post.title}</span>
        </div>
      </div>

      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-cream to-light-blush mb-8 flex items-center justify-center">
            <svg className="w-16 h-16 text-mauve/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="px-3 py-1 bg-cream text-navy text-xs font-medium tracking-wider uppercase rounded-full">{post.category}</span>
          <h1 className="font-heading text-4xl md:text-5xl text-navy mt-4 mb-4">{post.title}</h1>
          <p className="text-mauve text-sm mb-8">By {post.author}</p>
          <div className="prose prose-navy max-w-none text-navy/80 leading-relaxed space-y-4">
            <p>{post.excerpt}</p>
            <p>The journey toward understanding begins not with answers, but with the willingness to ask. In our practice, we are reminded again and again that the tools we reach for are not the source of insight — they are the invitation to look closer.</p>
            <p>Whether you are new to this path or have walked it for years, there is always something waiting to be uncovered. The key is not expertise. It is presence. It is the quiet act of returning, day after day, to the questions that matter most to you.</p>
            <p>We hope this reflection meets you well, wherever you are. And as always — may you find spirit here.</p>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl text-navy mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((r) => (
              <article key={r.id} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
                <div className="aspect-[16/10] bg-gradient-to-br from-cream to-light-blush flex items-center justify-center">
                  <svg className="w-10 h-10 text-mauve/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg text-navy mb-2">{r.title}</h3>
                  <Link href={`/blog/${r.id}`} className="text-navy font-medium text-sm tracking-wider uppercase hover:text-mauve transition-colors">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
