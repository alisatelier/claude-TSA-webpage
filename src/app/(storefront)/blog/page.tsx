"use client";

import Link from "next/link";
import { blogPosts } from "@/lib/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function BlogPage() {
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Journal</h1>
          <p className="font-accent italic text-white/70 text-lg">Insights, guides, and reflections for your practice</p>
        </div>
      </section>

      <section className="py-8 px-4 border-b border-cream">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
          {["All", "Rituals & Practices", "Divination Wisdom", "Seasonal Guides", "Community Stories", "Product Spotlights"].map((cat, i) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm transition-colors ${i === 0 ? "bg-navy text-white" : "bg-cream text-navy hover:bg-navy hover:text-white"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {featured && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-cream to-light-blush rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/3] bg-gradient-to-br from-navy/5 to-blush/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={faImage} className="w-16 h-16 text-mauve/20" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-xs font-medium text-blush uppercase tracking-wider mb-3">Featured</span>
                  <span className="px-3 py-1 bg-navy/10 text-navy text-xs font-medium tracking-wider uppercase rounded-full w-fit mb-4">{featured.category}</span>
                  <h2 className="font-heading text-3xl text-navy mb-4">{featured.title}</h2>
                  <p className="text-navy/70 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                  <Link href={`/blog/${featured.id}`} className="text-navy font-medium text-sm tracking-wider uppercase hover:text-mauve transition-colors inline-flex items-center gap-2">
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post) => (
              <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300">
                <div className="aspect-[16/10] bg-gradient-to-br from-cream to-light-blush flex items-center justify-center">
                  <FontAwesomeIcon icon={faImage} className="w-12 h-12 text-mauve/20" />
                </div>
                <div className="p-6">
                  <span className="px-3 py-1 bg-cream text-navy text-xs font-medium tracking-wider uppercase rounded-full">{post.category}</span>
                  <h3 className="font-heading text-xl text-navy mt-3 mb-2">{post.title}</h3>
                  <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="text-navy font-medium text-sm tracking-wider uppercase hover:text-mauve transition-colors inline-flex items-center gap-2">
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
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
