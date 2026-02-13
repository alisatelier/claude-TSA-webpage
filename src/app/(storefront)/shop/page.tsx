"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import { useCurrency } from "@/lib/CurrencyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faPaintbrush } from "@fortawesome/free-solid-svg-icons";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

// Products that should have synchronized carousels
const SYNCED_RUNE_PRODUCTS = ["norse-runes", "norse-runes-cloth"];

export default function ShopPage() {
  const { getProductPrice } = useCurrency();
  const [sortBy, setSortBy] = useState("featured");
  const [runesSyncIndex, setRunesSyncIndex] = useState(0);

  // Synchronized carousel timer for rune products (8 variants)
  useEffect(() => {
    const interval = setInterval(() => {
      setRunesSyncIndex((prev) => (prev + 1) % 8);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const sortedProducts = useMemo(() => {
    const result = [...products];
    if (sortBy === "price-asc") result.sort((a, b) => getProductPrice(a.prices) - getProductPrice(b.prices));
    if (sortBy === "price-desc") result.sort((a, b) => getProductPrice(b.prices) - getProductPrice(a.prices));
    return result;
  }, [sortBy, getProductPrice]);

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
                  <FontAwesomeIcon icon={faPrint} className="w-5 h-5 text-blush" />
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
                  <FontAwesomeIcon icon={faPaintbrush} className="w-5 h-5 text-blush" />
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
              <ProductCard
                key={product.id}
                product={product}
                syncIndex={SYNCED_RUNE_PRODUCTS.includes(product.id) ? runesSyncIndex : undefined}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
