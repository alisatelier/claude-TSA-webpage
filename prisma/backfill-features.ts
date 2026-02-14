import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: "whims-whispers-journal",
    stock: 15,
    variations: ["Grey", "Pink"],
  },
  {
    id: "whims-whispers-tarot",
    stock: 8,
    variations: ["Grey", "Pink"],
  },
  {
    id: "whims-whispers-spirit-board",
    stock: 3,
    variations: ["Black", "White"],
  },
  {
    id: "norse-runes",
    stock: 12,
    variations: [
      "Black | Gold",
      "Black | Silver",
      "Black | Copper",
      "White | Gold",
      "White | Silver",
      "White | Copper",
      "Sunset",
      "Moonrise",
      "Imperfect",
    ],
  },
  {
    id: "norse-runes-cloth",
    stock: 6,
    variations: [
      "Black | Gold",
      "Black | Silver",
      "Black | Copper",
      "White | Gold",
      "White | Silver",
      "White | Copper",
      "Sunset",
      "Moonrise",
    ],
  },
  {
    id: "my-intuition-made-me-do-it",
    stock: 25,
    variations: [],
  },
];

async function main() {
  console.log("Backfilling ProductStock...");

  for (const product of products) {
    if (product.variations.length === 0) {
      // No variations — single _default entry
      await prisma.productStock.upsert({
        where: {
          productId_variation: {
            productId: product.id,
            variation: "_default",
          },
        },
        update: {},
        create: {
          productId: product.id,
          variation: "_default",
          stock: product.stock,
        },
      });
      console.log(`  ${product.id}: _default = ${product.stock}`);
    } else {
      const perVariation = Math.floor(product.stock / product.variations.length);
      let remainder = product.stock % product.variations.length;

      for (const variation of product.variations) {
        const stock = perVariation + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;

        await prisma.productStock.upsert({
          where: {
            productId_variation: {
              productId: product.id,
              variation,
            },
          },
          update: {},
          create: {
            productId: product.id,
            variation,
            stock,
          },
        });
        console.log(`  ${product.id}: ${variation} = ${stock}`);
      }
    }
  }

  console.log("\nBackfilling approved=true on existing reviews...");
  const result = await prisma.review.updateMany({
    where: { approved: false },
    data: { approved: true },
  });
  console.log(`  Updated ${result.count} reviews to approved=true`);

  console.log("\nBackfill complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
