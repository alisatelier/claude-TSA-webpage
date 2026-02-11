"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

const categories = ["All", "Ritual Tools", "Divination Tools", "Literature"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [showHandmade, setShowHandmade] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.categories.includes(selectedCategory));
    }
    if (showHandmade) {
      result = result.filter((p) => p.badges.some((b) => b.includes("Handmade")));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [selectedCategory, sortBy, showHandmade, priceRange]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <button
        className="lg:hidden flex items-center gap-2 text-navy font-medium text-sm border border-navy/20 rounded-lg px-4 py-2.5 w-fit"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>

      <aside className={`lg:w-64 flex-shrink-0 ${filterOpen ? "block" : "hidden lg:block"}`}>
        <div className="bg-cream rounded-xl p-6 sticky top-24">
          <h3 className="font-heading text-xl text-navy mb-4">Filters</h3>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Category</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat ? "bg-navy text-white" : "text-navy/70 hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Special</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHandmade}
                onChange={(e) => setShowHandmade(e.target.checked)}
                className="rounded border-mauve text-navy focus:ring-navy"
              />
              <span className="text-sm text-navy/70">Handmade</span>
            </label>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Price Range</h4>
            <div className="flex items-center gap-2 text-sm text-navy/70">
              <span>${priceRange[0]}</span>
              <input type="range" min="0" max="150" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="flex-1 accent-navy" />
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <button onClick={() => { setSelectedCategory("All"); setShowHandmade(false); setPriceRange([0, 150]); }} className="text-sm text-mauve hover:text-navy transition-colors">
            Reset Filters
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-mauve">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</p>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-navy/20 rounded-lg text-sm text-navy bg-white focus:outline-none focus:border-navy">
            {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mauve text-lg font-accent italic mb-4">No products found</p>
            <button onClick={() => { setSelectedCategory("All"); setShowHandmade(false); setPriceRange([0, 150]); }} className="text-navy underline text-sm">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Shop</h1>
          <p className="font-accent italic text-white/70 text-lg">Tools crafted with intention, for your practice</p>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="text-center py-20 text-mauve">Loading...</div>}>
            <ShopContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
