"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import type { Product } from "@/lib/data";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= Math.round(rating) ? "text-blush" : "text-mauve/30"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export { StarRating };

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300">
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-cream">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-light-blush group-hover:scale-105 transition-transform duration-500">
          <span className="font-heading text-3xl text-navy/20">{product.name.charAt(0)}</span>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.categories.map((cat) => (
            <span key={cat} className="px-2.5 py-1 bg-navy/90 text-white text-[10px] font-medium tracking-wider uppercase rounded-full">
              {cat}
            </span>
          ))}
        </div>
        {product.stock <= 2 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-blush text-navy text-[10px] font-semibold tracking-wider uppercase rounded-full">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-mauve text-white text-[10px] font-semibold tracking-wider uppercase rounded-full">
            Sold Out
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/shop/${product.id}`}>
            <h3 className="font-heading text-lg text-navy leading-tight hover:text-mauve transition-colors">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-5 h-5 ${isWishlisted ? "text-blush fill-blush" : "text-mauve"}`}
              fill={isWishlisted ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <p className="text-mauve text-sm mb-3 line-clamp-2 font-accent italic">{product.shortDescription}</p>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-mauve">({product.reviewCount})</span>
        </div>
        {product.badges.some((b) => b.includes("Handmade")) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.badges
              .filter((b) => b.includes("Handmade"))
              .map((badge) => (
                <span key={badge} className="px-2 py-0.5 bg-cream text-navy/70 text-[10px] font-medium tracking-wider uppercase rounded-full">
                  {badge}
                </span>
              ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-navy">${product.price}</span>
          <Link
            href={`/shop/${product.id}`}
            className="px-4 py-2 bg-navy text-white text-xs font-medium tracking-wider uppercase rounded-lg hover:bg-navy/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
