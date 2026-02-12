"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, services, reviews } from "@/lib/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faStar,
  faImage,
  faArrowRight,
  faLayerGroup,
  faCubes,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const featuredProducts = products.slice(0, 4);
  const featuredReviews = reviews.slice(0, 6);

  const serviceIconMap: Record<string, typeof faLayerGroup> = {
    tarot: faLayerGroup,
    runes: faCubes,
    mentorship: faBookOpen,
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/products/Rune Set - Includes.jpg"
          alt="Rune Set"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-navy/60" />
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
            THE SPIIT ATELIE
          </h1>
          <p className="font-accent italic text-white/80 text-xl md:text-2xl mb-10">
            May You Find Spirit Here
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
          <FontAwesomeIcon
            icon={faArrowDown}
            className="w-6 h-6 text-white/50"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">
              Our Collection
            </h2>
            <p className="font-accent italic text-mauve text-lg">
              Tools crafted with intention, for your practice
            </p>
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
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6">
            THE SPIIT ATELIE
          </h2>
          <p className="font-accent italic text-mauve text-lg mb-4">
            Where craft meets ceremony
          </p>
          <p className="text-navy/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            We create handcrafted spiritual tools designed to support your
            journey with clarity, beauty, and intention. Each piece in our
            collection is made to be returned to — a companion in your practice.
            Whether you are beginning to explore or deepening an established
            path, our tools meet you where you are.
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
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">
              Our Services
            </h2>
            <p className="font-accent italic text-mauve text-lg">
              Guidance for your path
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-navy rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_4px_10px_rgba(83,91,115,0.15)]">
                  <Image
                    src="/images/logo-white.png"
                    alt="Spirit Atelier Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>

                <h3 className="font-heading text-2xl text-navy mb-2">
                  {service.name}
                </h3>
                <p className="text-mauve text-sm mb-1">{service.duration}</p>
                <p className="text-navy font-semibold text-lg mb-4">
                  ${service.startingPrice}
                </p>
                <p className="text-navy/70 text-sm mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <Link
                  href={`/services#${service.id}`}
                  className="inline-block px-6 py-2.5 bg-blush/30 text-navy font-medium rounded-lg hover:bg-light-blush transition-colors text-sm tracking-wider uppercase"
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
      <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">
        Messages from the Author
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredReviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] flex flex-col"
        >
          {/* Content Wrapper */}
          <div className="flex flex-col gap-4 flex-1">

            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`w-4 h-4 ${
                    star <= review.rating ? "text-blush" : "text-mauve/30"
                  }`}
                />
              ))}
            </div>

            {/* Product Title */}
            <h3 className="text-xl uppercase tracking-wider text-navy font-medium">
              {review.productName}
            </h3>

            {/* Review Text */}
            <p className="font-accent italic text-navy/80 text-sm leading-relaxed whitespace-pre-line">
              &ldquo;{review.text}&rdquo;
            </p>

          </div>

          {/* Reviewer (Pinned Bottom) */}
          <div className="pt-6 mt-auto flex items-center gap-2">
            <span className="text-navy font-medium text-sm">
              {review.reviewer}
            </span>
            {review.owner && (
              <span className="text-[10px] text-mauve font-medium uppercase tracking-wider">
                Owner
              </span>
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
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">
            Stay on the Path
          </h2>
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
          <p className="text-xs text-navy/50 mt-4">
            Get 10% off your first order when you subscribe
          </p>
        </div>
      </section>

      {/* Instagram / Social Feed Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">
            Follow the Journey
          </h2>
          <p className="font-accent italic text-mauve text-lg mb-10">
            @thespiritatelier
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-cream to-light-blush hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="w-8 h-8 text-mauve/30"
                  />
                </div>
              </div>
            ))}
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 mt-8 text-navy font-medium hover:text-mauve transition-colors text-sm tracking-wider uppercase"
          >
            Follow Us on Instagram
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}
