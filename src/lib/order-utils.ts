import { products, services } from "./data";

export function formatOrderNumber(n: number): string {
  if (n >= 1000000) return `#${n}`;
  return `#${String(n).padStart(6, "0")}`;
}

export function resolveProduct(productId: string): {
  name: string;
  image: string;
  isService: boolean;
} {
  const product = products.find((p) => p.id === productId);
  if (product) {
    return {
      name: product.name,
      image: product.images[0] ?? "",
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
