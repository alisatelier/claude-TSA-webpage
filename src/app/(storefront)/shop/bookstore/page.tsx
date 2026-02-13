"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { StarRating } from "@/components/ProductCard";

export default function BookstorePage() {
  const mimmdi = products.find((p) => p.id === "my-intuition-made-me-do-it");
  const { toggleWishlist, wishlist } = useCart();
  const { formatPrice, getProductPrice } = useCurrency();

  function getFirstImage() {
    if (!mimmdi) return null;
    const imgs = mimmdi.variationImages["_default"];
    if (imgs && imgs.length > 0) return imgs[0];
    return mimmdi.images[0] || null;
  }

  const image = getFirstImage();
  const isWishlisted = mimmdi ? wishlist.includes(mimmdi.id) : false;

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Bookstore</h1>
          <p className="font-accent italic text-white/70 text-lg">Stories written to inspire your journey</p>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-8 px-4 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-accent italic text-navy/70 text-lg">More Coming In Time...</p>
        </div>
      </section>

      {/* MIMMDI Feature */}
      {mimmdi && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <Link href={`/shop/${mimmdi.id}`} className="group block aspect-square rounded-xl overflow-hidden bg-cream relative">
                {image ? (
                  <Image
                    src={image}
                    alt={mimmdi.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-light-blush group-hover:scale-105 transition-transform duration-500">
                    <span className="font-heading text-8xl text-navy/20">M</span>
                  </div>
                )}
              </Link>

              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {mimmdi.badges.map((badge) => (
                    <span key={badge} className="px-3 py-1 bg-blush/30 text-navy text-xs font-medium tracking-wider uppercase rounded-full">{badge}</span>
                  ))}
                </div>

                <h2 className="font-heading text-4xl text-navy mb-2">{mimmdi.name}</h2>
                <p className="font-accent italic text-mauve text-lg mb-4">{mimmdi.shortDescription}</p>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={mimmdi.rating} />
                  <span className="text-sm text-mauve">({mimmdi.reviewCount} reviews)</span>
                </div>

                <p className="text-navy/80 leading-relaxed mb-6">
                  {mimmdi.description.split("\n\n")[0]}
                </p>

                <div className="bg-cream rounded-lg p-4 mb-6">
                  <p className="text-sm text-navy/70"><span className="font-semibold text-navy">Includes:</span> {mimmdi.includes}</p>
                </div>

                <p className="text-3xl font-semibold text-navy mb-6">{formatPrice(getProductPrice(mimmdi.prices))}</p>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/shop/${mimmdi.id}`}
                    className="px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => toggleWishlist(mimmdi.id)}
                    className="flex items-center gap-2 text-sm text-navy hover:text-mauve transition-colors"
                  >
                    <svg className={`w-5 h-5 ${isWishlisted ? "text-blush fill-blush" : ""}`} fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
