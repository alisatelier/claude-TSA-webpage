"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Wishlist</h1>
          <p className="font-accent italic text-white/70 text-lg">{wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-mauve" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="font-heading text-3xl text-navy mb-4">Your wishlist is empty</h2>
              <p className="text-mauve mb-8 font-accent italic">Save items you love for later.</p>
              <Link href="/shop" className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
