"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopPage() {
  const [sortBy, setSortBy] = useState("featured");

  const sortedProducts = useMemo(() => {
    const result = [...products];
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [sortBy]);

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Shop</h1>
          <p className="font-accent italic text-white/70 text-lg">Tools crafted with intention, for your practice</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl text-navy mb-8 text-center">What Makes These Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blush/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-navy">Locally Printed</h3>
              </div>
              <p className="text-navy/80 leading-relaxed text-sm">
                The guidebooks, journal, and cards are thoughtfully printed by a local Calgary small business, Little Rock Printing.
                 <br/>
                <br/>
                Supporting local craftsmanship matters deeply to The Spirit Atelier, and their care, precision, and consistency have helped bring each project including core offerings and physical marketing beautifully to life.
                <br/>
                <br/>
                Their partnership has been an integral and valued part of this work.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blush/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-navy">Handcrafted</h3>
              </div>
              <p className="text-navy/80 leading-relaxed text-sm mb-4">
                Each piece has been shaped through direct, intentional work — not mass production.
              </p>
              <ul className="space-y-2 text-sm text-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-blush mt-0.5">•</span>
                  The runes and spirit boards are cast from raw materials by hand.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blush mt-0.5">•</span>
                  The rune cloth designs are individually applied.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blush mt-0.5">•</span>
                  Each drawstring bag is finished with a logo placed by the creator herself.
                </li>
              </ul>
              <p className="text-navy/80 leading-relaxed text-sm mt-4 italic">
                Every step carries the imprint of care, time, and personal attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-mauve">{sortedProducts.length} products</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-navy/20 rounded-lg text-sm text-navy bg-white focus:outline-none focus:border-navy"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
