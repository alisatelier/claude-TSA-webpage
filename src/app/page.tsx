"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, services, reviews } from "@/lib/data";

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const featuredProducts = products.slice(0, 4);
  const featuredReviews = reviews.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy/80" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blush rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-mauve rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-light-blush rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Image
            src="/images/logo-white.png"
            alt="The Spirit Atelier"
            width={120}
            height={120}
            className="mx-auto mb-8 h-28 w-auto"
            priority
          />
          <h1 className="font-heading text-5xl md:text-7xl text-white mb-4 leading-tight">
            May you Find Spirit Here
          </h1>
          <p className="font-accent italic text-white/80 text-xl md:text-2xl mb-10">
            For You, On Your Journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-navy font-medium rounded-lg hover:bg-cream transition-colors text-sm tracking-wider uppercase"
            >
              Shop Ritual Tools
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 bg-transparent border-2 border-white/40 text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-sm tracking-wider uppercase"
            >
              Explore Services
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">Our Collection</h2>
            <p className="font-accent italic text-mauve text-lg">Tools crafted with intention, for your practice</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 border-2 border-navy text-navy font-medium rounded-lg hover:bg-navy hover:text-white transition-colors text-sm tracking-wider uppercase"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6">The Spirit Atelier</h2>
          <p className="font-accent italic text-mauve text-lg mb-4">
            Where craft meets ceremony
          </p>
          <p className="text-navy/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            We create handcrafted spiritual tools designed to support your journey with clarity,
            beauty, and intention. Each piece in our collection is made to be returned to —
            a companion in your practice, not a spectacle. Whether you are beginning to explore
            or deepening an established path, our tools meet you where you are.
          </p>
          <Link
            href="/about"
            className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">Our Services</h2>
            <p className="font-accent italic text-mauve text-lg">Guidance for your path</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
                  {service.icon === "tarot" && (
                    <svg className="w-7 h-7 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {service.icon === "runes" && (
                    <svg className="w-7 h-7 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {service.icon === "mentorship" && (
                    <svg className="w-7 h-7 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <h3 className="font-heading text-2xl text-navy mb-2">{service.name}</h3>
                <p className="text-mauve text-sm mb-1">{service.duration}</p>
                <p className="text-navy font-semibold text-lg mb-4">From ${service.startingPrice}</p>
                <p className="text-navy/70 text-sm mb-6 leading-relaxed line-clamp-3">{service.description}</p>
                <Link
                  href={`/services#${service.id}`}
                  className="inline-block px-6 py-2.5 bg-blush text-navy font-medium rounded-lg hover:bg-light-blush transition-colors text-sm tracking-wider uppercase"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">Voices from the Journey</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? "text-blush" : "text-mauve/30"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-accent italic text-navy/80 text-sm leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-navy font-medium text-sm">{review.reviewer}</span>
                  {review.verified && (
                    <span className="text-[10px] text-mauve font-medium uppercase tracking-wider">Verified</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-light-blush via-blush/30 to-cream">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">Stay on the Path</h2>
          <p className="font-accent italic text-navy/70 text-lg mb-8">
            Join our journey — receive spiritual insights and exclusive offers
          </p>
          {newsletterSubmitted ? (
            <div className="bg-white/60 rounded-xl p-8">
              <p className="font-accent italic text-navy text-lg">
                Welcome to the journey. Check your inbox for a gift.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewsletterSubmitted(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-lg border border-navy/20 bg-white/80 text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-navy/50 mt-4">Get 10% off your first order when you subscribe</p>
        </div>
      </section>

      {/* Instagram / Social Feed Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">Follow the Journey</h2>
          <p className="font-accent italic text-mauve text-lg mb-10">@thespiritatelier</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-cream to-light-blush hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-mauve/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 mt-8 text-navy font-medium hover:text-mauve transition-colors text-sm tracking-wider uppercase"
          >
            Follow Us on Instagram
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
