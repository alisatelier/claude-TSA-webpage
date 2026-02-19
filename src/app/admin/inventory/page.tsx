import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/data";
import ProductStockRow from "./ProductStockRow";

export default async function AdminInventoryPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  // Clean up legacy bare "Imperfect" stock rows — stock is now tracked
  // per-color as "Imperfect - {color}" (e.g. "Imperfect - Sunset")
  await prisma.productStock.deleteMany({ where: { variation: "Imperfect" } });

  const allStock = await prisma.productStock.findMany({
    orderBy: [{ productId: "asc" }, { variation: "asc" }],
  });

  const stockByProduct: Record<string, { variation: string; stock: number }[]> = {};
  for (const s of allStock) {
    if (!stockByProduct[s.productId]) stockByProduct[s.productId] = [];
    stockByProduct[s.productId].push({
      variation: s.variation ?? "_default",
      stock: s.stock,
    });
  }

  // Expand expected variations so every product shows all rows in admin,
  // including per-color imperfect sub-variants (e.g. "Imperfect - Sunset")
  for (const product of products) {
    const entries = stockByProduct[product.id] || [];
    const existingKeys = new Set(entries.map((e) => e.variation));

    const colorVariations = product.variations.filter((v) => v !== "Imperfect");
    const hasImperfect = product.variations.includes("Imperfect");

    // Build the full list of expected variation keys
    const expectedKeys: string[] = [];
    if (product.variations.length === 0) {
      expectedKeys.push("_default");
    } else {
      for (const v of colorVariations) expectedKeys.push(v);
      if (hasImperfect) {
        for (const v of colorVariations) expectedKeys.push(`Imperfect - ${v}`);
      }
    }

    // Merge missing keys with stock 0
    for (const key of expectedKeys) {
      if (!existingKeys.has(key)) {
        entries.push({ variation: key, stock: 0 });
      }
    }

    stockByProduct[product.id] = entries;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Inventory</h1>
      <div className="space-y-3">
        {products.map((product) => {
          const entries = stockByProduct[product.id] || [];
          const totalStock = entries.reduce((sum, e) => sum + e.stock, 0);

          // Get the main product image (first variation image or product image)
          const firstVariationKey = Object.keys(product.variationImages).find(
            (k) => k !== "Imperfect"
          );
          const productImage =
            (firstVariationKey && product.variationImages[firstVariationKey]?.[0]) ||
            product.images[0] ||
            "";

          // Map each stock entry to include its variation image
          const entriesWithImages = entries.map((entry) => {
            let varImages = product.variationImages[entry.variation];
            // For imperfect sub-variants like "Imperfect - Black | Gold",
            // fall back to the "Imperfect" key in variationImages
            if (!varImages && entry.variation.startsWith("Imperfect - ")) {
              varImages = product.variationImages["Imperfect"];
            }
            const defaultImages = product.variationImages["_default"];
            const image = varImages?.[0] || defaultImages?.[0] || product.images[0] || null;
            return { ...entry, image };
          });

          return (
            <ProductStockRow
              key={product.id}
              productId={product.id}
              productName={product.name}
              productImage={productImage}
              totalStock={totalStock}
              entries={entriesWithImages}
            />
          );
        })}
      </div>
    </div>
  );
}
