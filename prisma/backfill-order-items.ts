import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Inline product catalog for the backfill (avoids path-alias issues with tsx)
const products = [
  {
    id: "whims-whispers-journal",
    name: "Whims & Whispers Journal",
    price: 33,
    variations: ["Grey", "Pink"],
    variationImages: {
      Grey: ["/images/products/Journal - Grey - 1pg.jpg"],
      Pink: ["/images/products/Journal - Pink - 1pg.jpg"],
    },
    image: "/images/products/journal-1.jpg",
  },
  {
    id: "whims-whispers-tarot",
    name: "Whims & Whispers Tarot Deck",
    price: 44,
    variations: ["Grey", "Pink"],
    variationImages: {
      Grey: ["/images/products/Tarot - Grey - Major Arcana.jpg"],
      Pink: ["/images/products/Tarot - Pink - Major Arcana.jpg"],
    },
    image: "/images/products/tarot-1.jpg",
  },
  {
    id: "whims-whispers-spirit-board",
    name: "Whims & Whispers Spirit Board",
    price: 111,
    variations: ["Black", "White"],
    variationImages: {
      Black: ["/images/products/Spirit Board - Gradient - Navy.svg"],
      White: ["/images/products/Spirit Board - Gradient - Pink.svg"],
    },
    image: "/images/products/spirit-board-1.jpg",
  },
  {
    id: "norse-runes",
    name: "Norse Runes",
    price: 55,
    variations: [
      "Black | Gold", "Black | Silver", "Black | Copper",
      "White | Gold", "White | Silver", "White | Copper",
      "Sunset", "Moonrise", "Imperfect",
    ],
    variationImages: {
      "Black | Gold": ["/images/products/Rune Set - Black - Gold.jpg"],
      "Black | Silver": ["/images/products/Rune Set - Black - Silver.jpg"],
      "Black | Copper": ["/images/products/Rune Set - Black - Copper.jpg"],
      "White | Gold": ["/images/products/Rune Set - White - Gold.jpg"],
      "White | Silver": ["/images/products/Rune Set - White - Silver.jpg"],
      "White | Copper": ["/images/products/Rune Set - White - Copper.jpg"],
      Sunset: ["/images/products/Rune Set - Sunset.jpg"],
      Moonrise: ["/images/products/Rune Set - Moonrise.jpg"],
      Imperfect: ["/images/products/Rune Set - Imperfect.jpg"],
    },
    image: "/images/products/runes-1.jpg",
  },
  {
    id: "norse-runes-cloth",
    name: "Norse Runes & Cloth",
    price: 77,
    variations: [
      "Black | Gold", "Black | Silver", "Black | Copper",
      "White | Gold", "White | Silver", "White | Copper",
      "Sunset", "Moonrise",
    ],
    variationImages: {
      "Black | Gold": ["/images/products/Rune Cloth - Black - Gold.jpg"],
      "Black | Silver": ["/images/products/Rune Cloth - Black - Silver.jpg"],
      "Black | Copper": ["/images/products/Rune Cloth - Black - Copper.jpg"],
      "White | Gold": ["/images/products/Rune Cloth - White - Gold.jpg"],
      "White | Silver": ["/images/products/Rune Cloth - White - Silver.jpg"],
      "White | Copper": ["/images/products/Rune Cloth - White - Copper.jpg"],
      Sunset: ["/images/products/Rune Cloth - Sunset.jpg"],
      Moonrise: ["/images/products/Rune Cloth - Moonrise.jpg"],
    },
    image: "/images/products/runes-cloth-1.jpg",
  },
  {
    id: "my-intuition-made-me-do-it",
    name: "My Intuition Made Me Do It",
    price: 22,
    variations: [],
    variationImages: {},
    image: "/images/products/MIMMDI -  Roman a Clef.png",
  },
];

const services = [
  { id: "tarot-reading", name: "Tarot Reading", price: 66, icon: "tarot" },
  { id: "rune-reading", name: "Norse Rune Reading", price: 44, icon: "runes" },
  { id: "tarot-rune-reading", name: "Tarot & Norse Rune Reading", price: 88, icon: "combined" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const items = await prisma.orderItem.findMany({
    where: { name: "" },
  });

  console.log(`Found ${items.length} order items to backfill`);

  let updated = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      const variation =
        product.variations.length > 0 ? pick(product.variations) : null;
      const image = variation
        ? (product.variationImages as Record<string, string[]>)[variation]?.[0] ?? product.image
        : product.image;

      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          name: product.name,
          unitPrice: product.price * 100,
          variation,
          image,
        },
      });
      updated++;
      continue;
    }

    const service = services.find((s) => s.id === item.productId);
    if (service) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          name: service.name,
          unitPrice: service.price * 100,
          image: `/images/services/${service.icon}.jpg`,
        },
      });
      updated++;
      continue;
    }

    console.log(`  Skipped unknown productId: ${item.productId}`);
  }

  console.log(`Backfilled ${updated} order items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
