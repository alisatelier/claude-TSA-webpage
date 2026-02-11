"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  allImages?: string[];
  alt: string;
  autoScrollInterval?: number;
  variationSelected?: boolean;
}

export default function ImageCarousel({ 
  images, 
  allImages, 
  alt, 
  autoScrollInterval = 4000,
  variationSelected = false 
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use allImages unless a variation has been explicitly selected
  const displayImages = variationSelected 
    ? images 
    : (allImages && allImages.length > 0 ? allImages : images);

  // Mark image as loaded
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  }, []);

  // Preload next image
  useEffect(() => {
    if (displayImages.length <= 1) return;
    const nextIndex = activeIndex === displayImages.length - 1 ? 0 : activeIndex + 1;
    const prevIndex = activeIndex === 0 ? displayImages.length - 1 : activeIndex - 1;
    setLoadedImages((prev) => new Set([...prev, nextIndex, prevIndex]));
  }, [activeIndex, displayImages.length]);

  // Reset to first image when variation changes
  useEffect(() => {
    if (variationSelected) {
      setActiveIndex(0);
      setIsAutoScrolling(false);
      // Reset loaded images for new variation
      setLoadedImages(new Set([0]));
    }
  }, [variationSelected, images]);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 700);
  }, [displayImages.length]);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 700);
  }, [displayImages.length]);

  // Auto-scroll effect - only start after first image loads
  useEffect(() => {
    if (isAutoScrolling && displayImages.length > 1 && loadedImages.has(0)) {
      intervalRef.current = setInterval(goToNext, autoScrollInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoScrolling, displayImages.length, autoScrollInterval, goToNext, loadedImages]);

  const handleUserInteraction = (action: () => void) => {
    setIsAutoScrolling(false);
    action();
  };

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-cream to-light-blush flex items-center justify-center">
        <span className="font-heading text-8xl text-navy/10">{alt.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square rounded-xl overflow-hidden bg-cream relative mb-3">
        {/* Placeholder gradient while loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream to-light-blush flex items-center justify-center z-0">
          <span className="font-heading text-6xl text-navy/10">{alt.charAt(0)}</span>
        </div>
        
        {displayImages.map((img, i) => {
          // Only render images that are loaded or should be preloaded
          const shouldRender = loadedImages.has(i) || i === activeIndex || i === 0;
          if (!shouldRender) return null;
          
          return (
            <div
              key={`${img}-${i}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === activeIndex && loadedImages.has(i) ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} - Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(i)}
                onError={() => handleImageLoad(i)}
              />
            </div>
          );
        })}
        {/* Prev/Next arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => handleUserInteraction(goToPrev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-20"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleUserInteraction(goToNext)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-20"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        {/* Progress dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => handleUserInteraction(() => {
                  setIsTransitioning(true);
                  setActiveIndex(i);
                  setTimeout(() => setIsTransitioning(false), 700);
                })}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-navy w-4" : "bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={img}
              onClick={() => handleUserInteraction(() => {
                setIsTransitioning(true);
                setActiveIndex(i);
                setTimeout(() => setIsTransitioning(false), 700);
              })}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-navy" : "border-transparent hover:border-mauve/40"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
