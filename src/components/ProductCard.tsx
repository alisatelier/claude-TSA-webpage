"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import type { Product } from "@/lib/data";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= Math.round(rating) ? "text-[#FEDDE8]" : "text-[#FEDDE8]/30"}`}
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

function getAllImages(product: Product): string[] {
  const images: string[] = [];
  if (product.variationImages) {
    // Collect images from ALL variations (skip empty arrays and duplicates)
    Object.values(product.variationImages).forEach((varImages) => {
      if (varImages && varImages.length > 0) {
        varImages.forEach((img) => {
          if (img && img.trim() !== "" && !images.includes(img)) {
            images.push(img);
          }
        });
      }
    });
  }
  // Only include base product images if no variation images were found
  if (images.length === 0 && product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img && img.trim() !== "" && !images.includes(img)) {
        images.push(img);
      }
    });
  }
  return images;
}

function ProductCardCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = prev === images.length - 1 ? 0 : prev + 1;
      return next;
    });
  }, [images.length]);

  // Mark image as loaded
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  }, []);

  // Preload next image when current one is shown
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    // Add next index to loaded set to trigger render (preload)
    setLoadedImages((prev) => new Set([...prev, nextIndex]));
  }, [activeIndex, images.length]);

  // Start auto-scroll only after first image loads
  useEffect(() => {
    if (images.length <= 1 || !loadedImages.has(0)) return;
    
    // Small delay before starting auto-scroll
    const startDelay = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 500);
    
    return () => clearTimeout(startDelay);
  }, [images.length, loadedImages]);

  useEffect(() => {
    if (!isAutoScrolling || images.length <= 1) return;
    const interval = setInterval(goToNext, 3500);
    return () => clearInterval(interval);
  }, [isAutoScrolling, images.length, goToNext]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-light-blush">
        <span className="font-heading text-3xl text-navy/20">{alt.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-cream">
      {/* Placeholder gradient while loading */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream to-light-blush flex items-center justify-center">
        <span className="font-heading text-3xl text-navy/10">{alt.charAt(0)}</span>
      </div>
      
      {images.map((img, i) => {
        // Only render images that are loaded or should be preloaded
        const shouldRender = loadedImages.has(i) || i === activeIndex || i === 0;
        if (!shouldRender) return null;
        
        return (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === activeIndex && loadedImages.has(i) ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt={`${alt} - ${i + 1}`}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onLoad={() => handleImageLoad(i)}
              onError={() => handleImageLoad(i)} // Still mark as "loaded" to prevent getting stuck
            />
          </div>
        );
      })}
      {/* Progress dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((img, i) => (
            <span
              key={img}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-navy w-3" : "bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const allImages = getAllImages(product);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300 h-full flex flex-col">
      {/* Image Carousel */}
      <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-cream flex-shrink-0">
        <ProductCardCarousel images={allImages} alt={product.name} />
        {product.stock <= 2 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-blush text-navy text-[10px] font-semibold tracking-wider uppercase rounded-full z-10">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-mauve text-white text-[10px] font-semibold tracking-wider uppercase rounded-full z-10">
            Sold Out
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title row - fixed height area */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/shop/${product.id}`}>
            <h3 className="font-heading text-lg text-navy leading-tight hover:text-mauve transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name.startsWith("Whims & Whispers") ? (
                <>
                  Whims &amp; Whispers
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"> </span>
                  {product.name.replace("Whims & Whispers ", "")}
                </>
              ) : (
                product.name
              )}
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
        
        {/* Short description - fixed height */}
        <p className="text-mauve text-sm mb-3 line-clamp-2 font-accent italic min-h-[2.5rem]">{product.shortDescription}</p>
        
        {/* Reviews - fixed height */}
        <div className="flex items-center gap-2 mb-3 h-5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-mauve">({product.reviewCount})</span>
        </div>
        
        {/* Badges - flexible area that grows */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem] flex-grow">
          {product.badges.map((badge) => (
            <span key={badge} className="px-2 py-0.5 bg-[#A69FA5]/40 text-navy text-[10px] font-medium tracking-wider uppercase rounded-full h-fit">
              {badge}
            </span>
          ))}
        </div>
          
        {/* Price and CTA - always at bottom */}
        <div className="flex items-center justify-between mt-auto pt-2">
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
