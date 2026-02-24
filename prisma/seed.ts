import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categorySeeds = [
  {
    name: "Performance Gear",
    slug: "performance-gear",
    description: "High-performance essentials for power users.",
  },
  {
    name: "Workspace",
    slug: "workspace",
    description: "Desk and office upgrades for productive teams.",
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Studio-grade and everyday listening devices.",
  },
];

const productSeeds = [
  {
    name: "Flux Mechanical Keyboard",
    slug: "flux-mechanical-keyboard",
    description:
      "Low-latency wireless mechanical keyboard with hot-swappable switches and per-key RGB.",
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
    priceCents: 15900,
    compareAtPriceCents: 18900,
    sku: "KB-FLUX-001",
    inventory: 120,
    isPublished: true,
    categorySlug: "workspace",
  },
  {
    name: "Vector Ultralight Mouse",
    slug: "vector-ultralight-mouse",
    description:
      "Ergonomic magnesium-shell gaming mouse with optical switches and 4K polling.",
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    priceCents: 8900,
    compareAtPriceCents: 10900,
    sku: "MS-VCTR-001",
    inventory: 180,
    isPublished: true,
    categorySlug: "performance-gear",
  },
  {
    name: "Arc Pro Headphones",
    slug: "arc-pro-headphones",
    description:
      "Closed-back headphones with adaptive ANC, spatial audio, and 40-hour battery life.",
    imageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    priceCents: 22900,
    compareAtPriceCents: 25900,
    sku: "HP-ARC-001",
    inventory: 90,
    isPublished: true,
    categorySlug: "audio",
  },
  {
    name: "Orbit 4K Monitor",
    slug: "orbit-4k-monitor",
    description:
      "27-inch 4K IPS monitor with 144Hz refresh rate and USB-C power delivery.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    priceCents: 44900,
    compareAtPriceCents: 49900,
    sku: "MN-ORBT-001",
    inventory: 55,
    isPublished: true,
    categorySlug: "workspace",
  },
  {
    name: "Nimbus Laptop Stand",
    slug: "nimbus-laptop-stand",
    description:
      "CNC-machined aluminum laptop stand with adjustable viewing angles.",
    imageUrl:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
    priceCents: 6900,
    compareAtPriceCents: 7900,
    sku: "ST-NMBS-001",
    inventory: 210,
    isPublished: true,
    categorySlug: "workspace",
  },
  {
    name: "Nova USB-C Dock",
    slug: "nova-usb-c-dock",
    description:
      "12-in-1 dock with dual display output, 2.5GbE networking, and fast charging.",
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
    priceCents: 13900,
    compareAtPriceCents: 16900,
    sku: "DK-NOVA-001",
    inventory: 130,
    isPublished: true,
    categorySlug: "performance-gear",
  },
];

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@ecom.local" },
    update: {
      name: "Store Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      name: "Store Admin",
      email: "admin@ecom.local",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  for (const category of categorySeeds) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }

  for (const product of productSeeds) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
      select: { id: true },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        sku: product.sku,
        inventory: product.inventory,
        isPublished: product.isPublished,
        categoryId: category?.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        imageUrl: product.imageUrl,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        sku: product.sku,
        inventory: product.inventory,
        isPublished: product.isPublished,
        categoryId: category?.id,
      },
    });
  }

  console.log("Seed complete. Admin login: admin@ecom.local / Admin123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
