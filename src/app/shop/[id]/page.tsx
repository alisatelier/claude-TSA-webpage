"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { products, reviews } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { StarRating } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(product?.variations[0] || "");
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-navy mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-mauve hover:text-navy underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ productId: product.id, name: product.name, price: product.price, quantity, variation: selectedVariation, image: product.images[0] });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs = [
    { key: "description", label: "Description" },
    { key: "howto", label: "How To Work With It" },
    { key: "ritual", label: "Practicing in Ritual" },
    { key: "shipping", label: "Shipping Info" },
  ];

  return (
    <>
      <div className="bg-cream py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-mauve">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-navy transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-navy">{product.name}</span>
        </div>
      </div>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-cream to-light-blush flex items-center justify-center">
                <span className="font-heading text-8xl text-navy/10">{product.name.charAt(0)}</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.categories.map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-navy/10 text-navy text-xs font-medium tracking-wider uppercase rounded-full">{cat}</span>
                ))}
                {product.badges.map((badge) => (
                  <span key={badge} className="px-3 py-1 bg-blush/30 text-navy text-xs font-medium tracking-wider uppercase rounded-full">{badge}</span>
                ))}
              </div>

              <h1 className="font-heading text-4xl md:text-5xl text-navy mb-2">{product.name}</h1>
              <p className="font-accent italic text-mauve text-lg mb-4">{product.shortDescription}</p>

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={product.rating} size="md" />
                <span className="text-sm text-mauve">({product.reviewCount} reviews)</span>
              </div>

              <p className="text-3xl font-semibold text-navy mb-6">${product.price}</p>

              {product.stock <= 2 && product.stock > 0 && (
                <p className="text-sm text-blush font-medium mb-4">Only {product.stock} left in stock!</p>
              )}

              <div className="bg-cream rounded-lg p-4 mb-6">
                <p className="text-sm text-navy/70"><span className="font-semibold text-navy">Includes:</span> {product.includes}</p>
              </div>

              {product.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Variation</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.variations.map((v) => (
                      <button key={v} onClick={() => setSelectedVariation(v)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-colors ${selectedVariation === v ? "border-navy bg-navy text-white" : "border-navy/20 text-navy hover:border-navy"}`}
                      >{v}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-navy/20 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-navy hover:bg-cream transition-colors">-</button>
                  <span className="px-4 py-3 font-medium text-navy min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-navy hover:bg-cream transition-colors">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className={`flex-1 py-3.5 font-medium rounded-lg text-sm tracking-wider uppercase transition-colors ${addedToCart ? "bg-green-600 text-white" : product.stock === 0 ? "bg-mauve/30 text-mauve cursor-not-allowed" : "bg-navy text-white hover:bg-navy/90"}`}
                >{addedToCart ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}</button>
              </div>

              <button onClick={() => toggleWishlist(product.id)} className="flex items-center gap-2 text-sm text-navy hover:text-mauve transition-colors mb-8">
                <svg className={`w-5 h-5 ${isWishlisted ? "text-blush fill-blush" : ""}`} fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="flex overflow-x-auto gap-1 mb-8 border-b border-mauve/20">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium tracking-wider uppercase whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.key ? "border-navy text-navy" : "border-transparent text-mauve hover:text-navy"}`}
              >{tab.label}</button>
            ))}
          </div>
          <div className="bg-white rounded-xl p-8">
            {activeTab === "description" && product.description.split("\n\n").map((p, i) => (<p key={i} className="text-navy/80 leading-relaxed mb-4">{p}</p>))}
            {activeTab === "howto" && product.howToWork.split("\n\n").map((p, i) => (<p key={i} className="text-navy/80 leading-relaxed mb-4">{p}</p>))}
            {activeTab === "ritual" && product.ritual.split("\n\n").map((p, i) => (<p key={i} className="text-navy/80 leading-relaxed mb-4">{p}</p>))}
            {activeTab === "shipping" && (
              <div className="text-navy/80 leading-relaxed space-y-4">
                <p>Domestic orders typically ship within 2-3 business days and arrive within 5-7 business days.</p>
                <p>International shipping is available to most countries. Delivery times vary by location and may take 2-4 weeks.</p>
                <p>All orders are carefully packaged with the same intention with which they were made.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl text-navy mb-8">Customer Reviews</h2>
          {productReviews.length > 0 ? (
            <div className="space-y-6">
              {productReviews.map((review) => (
                <div key={review.id} className="bg-cream rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-navy">{review.reviewer}</span>
                      {review.verified && <span className="px-2 py-0.5 bg-navy/10 text-navy text-[10px] font-medium tracking-wider uppercase rounded-full">Verified</span>}
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-navy/80 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-cream rounded-xl">
              <p className="text-mauve font-accent italic">No reviews yet. Be the first to share your experience.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl text-navy mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </div>
      </section>
    </>
  );
}
