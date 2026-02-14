import { products, services } from "./data";

export function formatOrderNumber(n: number): string {
  if (n >= 1000000) return `#${n}`;
  return `#${String(n).padStart(6, "0")}`;
}

export function resolveProduct(productId: string, variation?: string): {
  name: string;
  image: string;
  isService: boolean;
} {
  const product = products.find((p) => p.id === productId);
  if (product) {
    // Use variation-specific image, then _default variation, then base images
    let image = product.variationImages?.["_default"]?.[0] ?? product.images[0] ?? "";
    if (variation && product.variationImages?.[variation]?.[0]) {
      image = product.variationImages[variation][0];
    }
    return {
      name: product.name,
      image,
      isService: false,
    };
  }

  const service = services.find((s) => s.id === productId);
  if (service) {
    return {
      name: service.name,
      image: `/images/services/${service.icon}.jpg`,
      isService: true,
    };
  }

  return { name: productId, image: "", isService: false };
}
