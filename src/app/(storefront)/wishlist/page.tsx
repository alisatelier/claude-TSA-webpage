"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { getTierProgress } from "@/lib/loyalty-utils";
import { products, services } from "@/lib/data";
import { useCurrency } from "@/lib/CurrencyContext";
import ProductCard from "@/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useCart();
  const { formatPrice, getProductPrice } = useCurrency();
  const { user, isLoggedIn, tier } = useAuth();

  // Build one entry per wishlist item (same product can appear multiple times with different variants)
  const wishlistProductEntries = wishlist
    .map((w) => ({ product: products.find((p) => p.id === w.productId), variation: w.variation }))
    .filter((e) => !!e.product) as { product: (typeof products)[number]; variation?: string }[];
  const wishlistServices = services.filter((s) => wishlist.some((w) => w.productId === s.id));
  const totalItems = wishlistProductEntries.length + wishlistServices.length;

  const progress = user ? getTierProgress(user.loyalty.lifetimeCredits) : null;

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
            Wishlist
          </h1>
          <p className="font-accent italic text-white/70 text-lg">
            {totalItems} {totalItems === 1 ? "item" : "items"} saved
          </p>
        </div>
      </section>

      {/* Credit summary card (logged-in only) */}
      {isLoggedIn && user && progress && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/account/rewards"
              className="block bg-cream rounded-xl p-6 
                   transition-all duration-300 
                   hover:shadow-[0_8px_24px_rgba(83,91,115,0.12)] 
                   hover:-translate-y-[2px]"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p>✨</p>
                  <div>
                    <p className="text-navy font-semibold">
                      {user.loyalty.currentCredits} Ritual Credits
                    </p>
                    <p className="text-sm text-mauve">
                      {user.loyalty.lifetimeCredits} lifetime credits
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-navy text-white text-xs font-medium tracking-wider uppercase rounded-full">
                    {tier}
                  </span>

                  {progress.nextTier && (
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-navy/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blush to-navy h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>

                      <p className="text-xs text-navy/70 whitespace-nowrap">
                        {progress.creditsToNext} to {progress.nextTier}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {totalItems === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faHeartRegular}
                  className="w-8 h-8 text-mauve"
                />
              </div>
              <h2 className="font-heading text-3xl text-navy mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-mauve mb-8 font-accent italic">
                Save items you love for later.
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
              >
                Browse Products & Services
              </Link>
            </div>
          ) : (
            <>
              {wishlistProductEntries.length > 0 && (
                <div className="mb-12">
                  {wishlistServices.length > 0 && (
                    <h2 className="font-heading text-2xl text-navy mb-6">
                      Saved Products
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistProductEntries.map((entry) => (
                      <ProductCard
                        key={`${entry.product.id}-${entry.variation || ""}`}
                        product={entry.product}
                        savedVariation={entry.variation}
                      />
                    ))}
                  </div>
                </div>
              )}

              {wishlistServices.length > 0 && (
                <div>
                  {wishlistProductEntries.length > 0 && (
                    <h2 className="font-heading text-2xl text-navy mb-6">
                      Saved Services
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistServices.map((service) => (
                      <div
                        key={service.id}
                        className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)]"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-heading text-xl text-navy">
                            {service.name}
                          </h3>
                          <button
                            onClick={() => toggleWishlist(service.id)}
                            className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
                            aria-label="Remove from wishlist"
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="w-5 h-5 text-blush"
                            />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-mauve mb-3">
                          <span>{service.duration}</span>
                          <span className="text-mauve/30">|</span>
                          <span className="font-semibold text-navy">
                            From {formatPrice(getProductPrice(service.startingPrices))}
                          </span>
                        </div>
                        <p className="text-sm text-navy/70 leading-relaxed mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <Link
                          href={`/services#${service.id}`}
                          className="text-sm text-navy underline underline-offset-2 decoration-mauve/40 hover:decoration-navy transition-colors font-medium"
                        >
                          View Service
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
