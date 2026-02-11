"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { products, reviews } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { StarRating } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import ImageCarousel from "@/components/ImageCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function ProductPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(product?.variations.filter(v => v !== "Imperfect")[0] || "");
  const [isImperfect, setIsImperfect] = useState(false);
  const [variationSelected, setVariationSelected] = useState(false);
  const [openTabs, setOpenTabs] = useState<Set<string>>(new Set(["description"]));
  const [activeTab, setActiveTab] = useState("description"); // For desktop tabs
  const [addedToCart, setAddedToCart] = useState(false);

  // Includes images for specific products (shown on product page only)
  const includesImage = useMemo(() => {
    if (!product) return null;
    if (product.id === "norse-runes") return "/images/products/Rune Set - Includes.jpg";
    if (product.id === "norse-runes-cloth") return "/images/products/Rune Cloth - Includes.jpg";
    return null;
  }, [product]);

  // Get all images from all variations for auto-scroll (excluding Imperfect)
  const allImages = useMemo(() => {
    if (!product) return [];
    const images: string[] = [];
    const seen = new Set<string>();

    Object.entries(product.variationImages).forEach(([key, varImages]) => {
      // Skip Imperfect images in the main carousel
      if (key === "Imperfect") return;
      varImages.forEach((img) => {
        if (!seen.has(img)) {
          seen.add(img);
          images.push(img);
        }
      });
    });

    // Fallback to product.images if no variation images
    if (images.length === 0) {
      return includesImage ? [...product.images, includesImage] : product.images;
    }

    // Add includes image at the end for product page carousel
    if (includesImage) {
      images.push(includesImage);
    }

    return images;
  }, [product, includesImage]);

  // Get current variation images
  const currentImages = useMemo(() => {
    if (!product) return [];

    // If Imperfect is selected, show both Imperfect image and selected variant image
    if (isImperfect && selectedVariation) {
      const imperfectImages = product.variationImages["Imperfect"] || [];
      const variantImages = product.variationImages[selectedVariation] || [];
      const images = [...imperfectImages, ...variantImages];
      if (includesImage) images.push(includesImage);
      return images;
    }

    const key = selectedVariation || "_default";
    const varImages = product.variationImages[key];
    if (varImages && varImages.length > 0) {
      return includesImage ? [...varImages, includesImage] : varImages;
    }
    const defaultImages = product.variationImages["_default"];
    if (defaultImages && defaultImages.length > 0) {
      return includesImage ? [...defaultImages, includesImage] : defaultImages;
    }
    return includesImage ? [...product.images, includesImage] : product.images;
  }, [product, selectedVariation, isImperfect, includesImage]);

  const handleVariationSelect = (variation: string) => {
    setSelectedVariation(variation);
    setVariationSelected(true);
  };

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

  // Special pricing for "Imperfect" variation
  const displayPrice = isImperfect ? 33 : product.price;

  // Get color variations (excluding Imperfect)
  const colorVariations = product.variations.filter(v => v !== "Imperfect");
  const hasImperfectOption = product.variations.includes("Imperfect");

  // Full variation string for cart
  const fullVariation = isImperfect ? `Imperfect - ${selectedVariation}` : selectedVariation;

  const handleAddToCart = () => {
    addToCart({ productId: product.id, name: product.name, price: displayPrice, quantity, variation: fullVariation, image: currentImages[0] || product.images[0] });
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
              <ImageCarousel
                images={currentImages}
                allImages={allImages}
                alt={product.name}
                variationSelected={variationSelected}
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.categories.map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-navy/10 text-navy text-xs font-medium tracking-wider uppercase rounded-full">{cat}</span>
                ))}
                {product.badges.map((badge) => (
                  <span key={badge} className="px-3 py-1 bg-mauve/40 text-navy text-xs font-medium tracking-wider uppercase rounded-full">{badge}</span>
                ))}
              </div>

              <h1 className="font-heading text-4xl md:text-5xl text-navy mb-2">{product.name}</h1>
              <p className="font-accent italic text-mauve text-lg mb-4">{product.shortDescription}</p>

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={product.rating} size="md" />
                <span className="text-sm text-mauve">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {isImperfect ? (
                  <>
                    <p className="text-3xl font-semibold text-navy">${displayPrice}</p>
                    <p className="text-xl text-mauve/60 line-through">${product.price}</p>
                    <span className="px-2 py-1 bg-blush/40 text-navy text-xs font-medium rounded-full">40% OFF</span>
                  </>
                ) : (
                  <p className="text-3xl font-semibold text-navy">${product.price}</p>
                )}
              </div>

              {product.stock <= 2 && product.stock > 0 && (
                <p className="text-sm text-blush font-medium mb-4">Only {product.stock} left in stock!</p>
              )}

              <div className="bg-cream rounded-lg p-4 mb-6">
                <p className="text-sm text-navy/70"><span className="font-semibold text-navy">Includes:</span> {product.includes}</p>
              </div>

              {product.variations.length > 0 && (
                <div className="mb-6">
                  {/* Imperfect Toggle */}
                  {hasImperfectOption && (
                    <div className="mb-4">
                      <button
                        onClick={() => setIsImperfect(!isImperfect)}
                        className={`px-4 py-2 rounded-lg text-sm border-2 border-dashed transition-colors ${isImperfect ? "border-blush bg-blush/20 text-navy" : "border-blush/50 text-mauve hover:border-blush hover:bg-blush/10"}`}
                      >
                        {isImperfect ? "✓ " : ""}Imperfect Set <span className="text-xs opacity-70">— 40% off</span>
                      </button>
                    </div>
                  )}

                  {/* Color Selection */}
                  <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
                    {isImperfect ? "Select Your Colour" : "Variation"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {colorVariations.map((v) => (
                      <button key={v} onClick={() => handleVariationSelect(v)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-colors ${selectedVariation === v ? "border-navy bg-navy text-white" : "border-navy/20 text-navy hover:border-navy"}`}
                      >{v}</button>
                    ))}
                  </div>

                  {/* Imperfect Disclaimer */}
                  {isImperfect && (
                    <div className="mt-4 p-4 bg-blush/10 border border-blush/30 rounded-lg">
                        <p className="text-sm text-navy/80 leading-relaxed">
                        <span className="font-semibold text-navy">About Imperfect Sets:</span>
                        <br />
                        These pieces may bear small aesthetic irregularities, yet remain fully functional and thoughtfully made.
                        <br />
                        <br />
                        Imperfections may include separation, bubbles, fluffs, and other marks.
                        <br />
                        <br />
                        Each set is still worthy of a place in a cherished collection and is offered at a gentle price in reflection of its imperfections.
                        </p>
                    </div>
                  )}
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
                <FontAwesomeIcon
                  icon={isWishlisted ? faHeart : faHeartRegular}
                  className={`w-5 h-5 ${isWishlisted ? "text-blush" : ""}`}
                />
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-cream">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-1 mb-8 border-b border-mauve/20">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium tracking-wider uppercase whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.key ? "border-navy text-navy" : "border-transparent text-mauve hover:text-navy"}`}
              >{tab.label}</button>
            ))}
          </div>
          <div className="hidden md:block bg-white rounded-xl p-8">
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

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-3">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                id={`accordion-${tab.key}`}
                className="bg-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => {
                    setOpenTabs(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(tab.key)) {
                        newSet.delete(tab.key);
                      } else {
                        newSet.add(tab.key);
                      }
                      return newSet;
                    });
                  }}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <span className={`text-sm font-medium tracking-wider uppercase ${openTabs.has(tab.key) ? "text-navy" : "text-mauve"}`}>
                    {tab.label}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-5 h-5 transition-transform ${openTabs.has(tab.key) ? "rotate-180 text-navy" : "text-mauve"}`}
                  />
                </button>
                {openTabs.has(tab.key) && (
                  <div className="px-5 pb-2 pt-4 border-t border-cream">
                    {tab.key === "description" && product.description.split("\n\n").map((p, i) => (<p key={i} className="text-navy/80 leading-relaxed mb-4 text-sm last:mb-0">{p}</p>))}
                    {tab.key === "howto" && product.howToWork.split("\n\n").map((p, i) => (<p key={i} className="text-navy/80 leading-relaxed mb-4 text-sm last:mb-0">{p}</p>))}
                    {tab.key === "ritual" && product.ritual.split("\n\n").map((p, i) => (<p key={i} className="text-navy/80 leading-relaxed mb-4 text-sm last:mb-0">{p}</p>))}
                    {tab.key === "shipping" && (
                      <div className="text-navy/80 leading-relaxed space-y-4 text-sm">
                        <p>Domestic orders typically ship within 2-3 business days and arrive within 5-7 business days.</p>
                        <p>International shipping is available to most countries. Delivery times vary by location and may take 2-4 weeks.</p>
                        <p>All orders are carefully packaged with the same intention with which they were made.</p>
                      </div>
                    )}
                    {/* Close bar */}
                    <button
                      onClick={() => {
                        const header = document.getElementById(`accordion-${tab.key}`);

                        setOpenTabs(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(tab.key);
                          return newSet;
                        });

                        // After close, scroll header to top of viewport
                        requestAnimationFrame(() => {
                          if (header) {
                            const headerOffset = 80;
                            const headerPosition = header.getBoundingClientRect().top;
                            const scrollTarget = window.pageYOffset + headerPosition - headerOffset;
                            window.scrollTo({ top: scrollTarget, behavior: 'instant' });
                          }
                        });
                      }}
                      className="w-full mt-4 py-3 flex justify-center items-center text-mauve hover:text-navy transition-colors"
                    >
                      <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            ))}
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
