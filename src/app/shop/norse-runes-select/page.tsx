"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";

export default function NorseRunesSelectPage() {
  const runesOnly = products.find((p) => p.id === "norse-runes");
  const runesCloth = products.find((p) => p.id === "norse-runes-cloth");

  const runeProducts = [runesOnly, runesCloth].filter(Boolean);

  function getFirstImage(product: typeof runesOnly) {
    if (!product) return null;
    if (product.variationImages) {
      const firstKey = product.variations[0] || "_default";
      const imgs = product.variationImages[firstKey];
      if (imgs && imgs.length > 0) return imgs[0];
    }
    return product.images[0] || null;
  }

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Norse Runes</h1>
          <p className="font-accent italic text-white/70 text-lg">Choose your path to ancient wisdom</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {runeProducts.map((product) => {
              if (!product) return null;
              const image = getFirstImage(product);
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(83,91,115,0.08)] hover:shadow-[0_8px_24px_rgba(83,91,115,0.15)] transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-cream relative">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-light-blush group-hover:scale-105 transition-transform duration-500">
                        <span className="font-heading text-6xl text-navy/20">{product.name.charAt(0)}</span>
                      </div>
                    )}
                    {product.stock <= 2 && product.stock > 0 && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-blush text-navy text-[10px] font-semibold tracking-wider uppercase rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <div className="p-8 text-center">
                    <h2 className="font-heading text-3xl text-navy mb-2">{product.name}</h2>
                    <p className="font-accent italic text-mauve text-sm mb-4">{product.shortDescription}</p>
                    <p className="text-sm text-navy/70 mb-4">{product.includes}</p>
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                      {product.badges.map((badge) => (
                        <span key={badge} className="px-2 py-0.5 bg-cream text-navy/70 text-[10px] font-medium tracking-wider uppercase rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <p className="text-2xl font-semibold text-navy mb-4">${product.price}</p>
                    <span className="inline-block px-6 py-3 bg-navy text-white text-xs font-medium tracking-wider uppercase rounded-lg group-hover:bg-navy/90 transition-colors">
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
