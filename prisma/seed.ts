import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categorySeeds = [
  {
    name: "Keyboards",
    slug: "keyboards",
    description: "Mechanical and low-profile keyboards for work and gaming setups.",
  },
  {
    name: "Mice",
    slug: "mice",
    description: "Precision wired and wireless mice for productivity and performance.",
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Headphones and desktop audio gear for focused sessions.",
  },
  {
    name: "Desk Setup",
    slug: "desk-setup",
    description: "Workspace essentials including stands, lighting, and ergonomic upgrades.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Everyday carry accessories for charging, travel, and organization.",
  },
];

const productSeeds = [
  {
    name: "Aurora Mechanical Keyboard",
    slug: "aurora-mechanical-keyboard",
    description:
      "Hot-swappable 75% keyboard with pre-lubed linear switches and programmable layers.",
    imageUrl: null,
    priceCents: 12900,
    compareAtPriceCents: 14900,
    sku: "KB-AURORA-75",
    inventory: 54,
    isPublished: true,
    categorySlug: "keyboards",
  },
  {
    name: "Vector Wireless Mouse",
    slug: "vector-wireless-mouse",
    description:
      "Ergonomic wireless mouse with adjustable DPI profiles and USB-C fast charging.",
    imageUrl: null,
    priceCents: 6900,
    compareAtPriceCents: 7900,
    sku: "MS-VECTOR-WL",
    inventory: 88,
    isPublished: true,
    categorySlug: "mice",
  },
  {
    name: "Echo ANC Headphones",
    slug: "echo-anc-headphones",
    description:
      "Over-ear headphones with hybrid active noise cancellation and 40-hour battery life.",
    imageUrl: null,
    priceCents: 18900,
    compareAtPriceCents: 21900,
    sku: "AU-ECHO-ANC",
    inventory: 42,
    isPublished: true,
    categorySlug: "audio",
  },
  {
    name: "Nimbus Laptop Stand",
    slug: "nimbus-laptop-stand",
    description:
      "Foldable aluminum stand with adjustable height to improve posture and airflow.",
    imageUrl: null,
    priceCents: 4900,
    compareAtPriceCents: 5900,
    sku: "DS-NIMBUS-ST",
    inventory: 103,
    isPublished: true,
    categorySlug: "desk-setup",
  },
  {
    name: "Atlas USB-C Dock",
    slug: "atlas-usb-c-dock",
    description:
      "Compact 9-in-1 dock with dual display output, Ethernet, and high-speed passthrough charging.",
    imageUrl: null,
    priceCents: 9900,
    compareAtPriceCents: 11900,
    sku: "AC-ATLAS-DOCK",
    inventory: 67,
    isPublished: true,
    categorySlug: "accessories",
  },
  {
    name: "Orbit 4K Webcam",
    slug: "orbit-4k-webcam",
    description:
      "4K webcam with auto-framing, dual microphones, and low-light correction for calls.",
    imageUrl: null,
    priceCents: 12900,
    compareAtPriceCents: 14900,
    sku: "AC-ORBIT-CAM",
    inventory: 38,
    isPublished: true,
    categorySlug: "accessories",
  },
  {
    name: "Pulse Monitor Light Bar",
    slug: "pulse-monitor-light-bar",
    description:
      "Glare-free monitor light bar with adjustable warmth and touch controls.",
    imageUrl: null,
    priceCents: 7900,
    compareAtPriceCents: 8900,
    sku: "DS-PULSE-LB",
    inventory: 74,
    isPublished: true,
    categorySlug: "desk-setup",
  },
  {
    name: "Flow XL Desk Mat",
    slug: "flow-xl-desk-mat",
    description:
      "Water-resistant extended desk mat with stitched edges and smooth glide surface.",
    imageUrl: null,
    priceCents: 3200,
    compareAtPriceCents: 3900,
    sku: "DS-FLOW-MAT",
    inventory: 140,
    isPublished: true,
    categorySlug: "desk-setup",
  },
];

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const retainedCategorySlugs = categorySeeds.map((category) => category.slug);
  const retainedProductSlugs = productSeeds.map((product) => product.slug);

  const removableProducts = await prisma.product.findMany({
    where: {
      slug: {
        notIn: retainedProductSlugs,
      },
    },
    select: {
      id: true,
    },
  });
  const removableProductIds = removableProducts.map((product) => product.id);

  if (removableProductIds.length > 0) {
    await prisma.cartItem.deleteMany({
      where: {
        productId: {
          in: removableProductIds,
        },
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        productId: {
          in: removableProductIds,
        },
      },
    });

    await prisma.product.deleteMany({
      where: {
        id: {
          in: removableProductIds,
        },
      },
    });
  }

  await prisma.category.deleteMany({
    where: {
      slug: {
        notIn: retainedCategorySlugs,
      },
    },
  });

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
