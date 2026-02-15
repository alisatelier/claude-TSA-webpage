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

  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        passwordHash,
      },
      create: {
        name: "Admin",
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("Admin ensured:", email);
  } else {
    console.log("Skipping admin upsert (ADMIN_EMAIL or ADMIN_PASSWORD not set)");
  }

  // Seed blog posts
  const blogPosts = [
    {
      slug: "choose-first-divination-tool",
      title: "How to Choose Your First Divination Tool",
      category: "Divination Wisdom",
      excerpt: "Choosing your first divination tool is less about finding the right one and more about allowing the right one to find you. Here is how to begin.",
      image: "/images/blog/divination-tool.jpg",
      featured: true,
    },
    {
      slug: "creating-sacred-space",
      title: "Creating a Sacred Space: A Beginner's Guide",
      category: "Rituals & Practices",
      excerpt: "Your sacred space does not need to be elaborate. It simply needs to be yours. Learn how to create a space that supports your practice.",
      image: "/images/blog/sacred-space.jpg",
    },
    {
      slug: "art-of-ritual",
      title: "The Art of Ritual: Daily Practices for Grounding",
      category: "Rituals & Practices",
      excerpt: "Ritual does not require perfection. It requires presence. Discover simple daily practices that anchor you in intention and awareness.",
      image: "/images/blog/daily-ritual.jpg",
    },
    {
      slug: "moon-phases-manifestation",
      title: "Moon Phases and Manifestation",
      category: "Seasonal Guides",
      excerpt: "The moon has guided seekers for millennia. Learn how to align your intentions with lunar cycles for deeper manifestation practice.",
      image: "/images/blog/moon-phases.jpg",
    },
    {
      slug: "tarot-self-reflection",
      title: "Tarot for Self-Reflection: Getting Started",
      category: "Divination Wisdom",
      excerpt: "Tarot is not about predicting the future. It is about understanding the present. Here is how to begin using tarot as a mirror.",
      image: "/images/blog/tarot-reflection.jpg",
    },
    {
      slug: "power-of-journaling",
      title: "The Power of Journaling in Your Practice",
      category: "Rituals & Practices",
      excerpt: "Writing is one of the oldest forms of self-communion. Explore how journaling deepens your spiritual practice and reveals hidden patterns.",
      image: "/images/blog/journaling.jpg",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        image: post.image,
      },
      create: {
        slug: post.slug,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        image: post.image,
        featured: post.featured ?? false,
        author: "The Spirit Atelier",
      },
    });
  }

  console.log("Blog posts seeded:", blogPosts.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
