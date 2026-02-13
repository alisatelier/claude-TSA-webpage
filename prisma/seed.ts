import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) throw new Error("Missing ADMIN_EMAIL");
  if (!password) throw new Error("Missing ADMIN_PASSWORD");

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      passwordHash, // ← THIS IS THE FIX
    },
    create: {
      name: "Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin ensured:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
