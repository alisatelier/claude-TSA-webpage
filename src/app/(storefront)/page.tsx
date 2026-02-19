"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { products, services, reviews } from "@/lib/data";
import JsonLd from "@/components/JsonLd";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Spirit Atelier",
  url: "https://thespiritatelier.ca",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://thespiritatelier.ca/shop?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};
import { useCurrency } from "@/lib/CurrencyContext";
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
  const { formatPrice, getProductPrice } = useCurrency();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [productRatings, setProductRatings] = useState<
    Record<string, { average: number; count: number }>
  >({});
  const [blogPosts, setBlogPosts] = useState<
    { slug: string; title: string; category: string; excerpt: string; image: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/reviews/ratings")
      .then((res) => (res.ok ? res.json() : { ratings: {} }))
      .then((data) => setProductRatings(data.ratings ?? {}))
      .catch(() => {});
    fetch("/api/blog/featured")
      .then((res) => (res.ok ? res.json() : { posts: [] }))
      .then((data) => setBlogPosts(data.posts ?? []))
      .catch(() => {});
  }, []);

  const featuredProducts = products.slice(0, 4);
  const featuredReviews = reviews.slice(0, 6);

  const serviceIconMap: Record<string, typeof faLayerGroup> = {
    tarot: faLayerGroup,
    runes: faCubes,
    mentorship: faBookOpen,
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/products/Rune Set - Includes.jpg"
          alt="Handcrafted Elder Futhark resin rune set by The Spirit Atelier displayed with gilded metal finish pieces, guidebook, and drawstring bag"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Image
            src="/images/logo-white.png"
            alt="The Spirit Atelier logo — handcrafted spiritual tools for tarot, runes, and intentional practice"
            width={120}
            height={120}
            className="mx-auto mb-8 h-28 w-auto"
            priority
          />
          {/*} DO NOT CHANGE THE SPIIT ATELIE  THERE ARE SPECIAL CHARACTERS */}
          <h1 className="font-heading text-5xl md:text-7xl text-white mb-4 leading-tight">
            THE SPIIT ATELIE
          </h1>
          <p className="font-accent italic text-white/80 text-xl md:text-2xl mb-6">
            May You Find Spirit Here
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 max-w-3xl mx-auto mb-10">
            <p className="text-white/90 text-sm md:text-base leading-relaxed tracking-wide">
              Here, we craft nuanced and signature divination tools which honour classical and historical origins. 
              Their contemporary designs appeal to the modern practicioner, as our tarot and norse runes are approached as advanced systems. 
              </p>
              <p className="text-white/90 text-sm mt-4 md:text-base leading-relaxed tracking-wide">These tools were
              created to help you engage your intuition with discipline, insight, and depth.
            </p>
          </div>
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
              <ProductCard key={product.id} product={product} averageRating={productRatings[product.id]?.average} />
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

      {/* Services Overview */}
      <section className="py-20 px-4 bg-navy">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-3">
              Our Services
            </h2>
            <p className="font-accent italic text-cream text-lg">
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
                    alt="The Spirit Atelier — tarot readings, rune readings, and spiritual guidance services"
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
                  {formatPrice(getProductPrice(service.startingPrices))}
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

      {/* About Snippet */}
      <section className="py-20 px-4 ">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 items-center bg-navy p-8 rounded-xl">
          <div className="md:col-span-2">
            <h2 className="font-heading text-4xl text-white mb-6">
              About A. K. Bird
            </h2>

            <div className="space-y-6 text-white leading-relaxed">
              <p>
                A. K. Bird writes stories about intuition, unraveling, and
                becoming.
              </p>

              <p>
                Her work explores the quiet turning points that reshape a
                woman’s life and the inner knowing that refuses to be silenced.
              </p>

              <p>
                Alongside her novels, she designs tarot decks, rune sets, and
                ritual tools through The Spirit Atelier.
              </p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end md:mt-12">
            <div className="w-[75vw] max-w-[500px] aspect-square relative">
              <svg viewBox="0 0 100 100" className="absolute w-0 h-0">
                <defs>
                  <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                    <path
                      d="M0.5,0.9 C0.1,0.6 0,0.35 0.25,0.2 
                       C0.4,0.1 0.5,0.25 0.5,0.25 
                       C0.5,0.25 0.6,0.1 0.75,0.2 
                       C1,0.35 0.9,0.6 0.5,0.9 Z"
                    />
                  </clipPath>
                </defs>
              </svg>

              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{
                  clipPath: "url(#heartClip)",
                  objectPosition: "center 18%",
                }}
              >
                <source src="/videos/portrait-loop.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
              Belonging Has Its Rewards
            </h2>
            <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-4">
              <em>The Atelier Recognizes You </em>is our loyalty program. A quiet
              gesture of gratitude for those who return, reflect, and
              participate in the practice.
            </p>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
              Earn credits through purchases, referrals, and seasonal
              milestones. Redeem them toward the tools that enhance your
              journey.
            </p>
          </div>

          <span className="mt-10 inline-block">
            <Link
              href="/loyalty"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cream via-white to-cream text-navy font-semibold tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              ✨ Explore the Loyalty Program ✨
            </Link>
          </span>
        </div>
      </section>

      {/* Guidance Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-3">
              Guidance
            </h2>
            <p className="font-accent italic text-mauve text-lg mb-10">
              Insights, guides, and reflections for your practice
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/guidance/${post.slug}`} className="block h-full">
                  <article className="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300">
                    <div className="aspect-[4/3] bg-gradient-to-br from-cream to-light-blush flex items-center justify-center relative flex-shrink-0">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faImage} className="w-12 h-12 text-mauve/20" />
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="px-3 py-1 bg-cream text-navy text-xs font-medium tracking-wider uppercase rounded-full w-fit">{post.category}</span>
                      <h3 className="font-heading text-xl text-navy mt-3 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                      <span className="text-navy font-medium text-sm tracking-wider uppercase hover:text-mauve transition-colors inline-flex items-center gap-2 mt-auto">
                        Read More
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <Link
              href="/guidance"
              className="inline-flex items-center gap-2 mt-8 text-navy font-medium hover:text-mauve transition-colors text-sm tracking-wider uppercase"
            >
              View All Guidance
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
