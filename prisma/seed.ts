import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categorySeeds = [
  {
    name: "Flower",
    slug: "flower",
    description: "Indoor and sungrown whole flower selected by terpene profile.",
  },
  {
    name: "Pre-Rolls",
    slug: "pre-rolls",
    description: "Single pre-rolls and multi-packs rolled with premium grind.",
  },
  {
    name: "Vapes",
    slug: "vapes",
    description: "Live resin and rosin cartridges for flavor-forward sessions.",
  },
  {
    name: "Edibles",
    slug: "edibles",
    description: "Precisely dosed gummies and chews with balanced cannabinoid ratios.",
  },
  {
    name: "Concentrates",
    slug: "concentrates",
    description: "Solventless hash rosin, badder, and high-potency extracts.",
  },
];

const productSeeds = [
  {
    name: "Reaper Reserve Night Bloom 3.5g",
    slug: "reaper-reserve-night-bloom-3-5g",
    description:
      "Dense, hand-trimmed indica flower with notes of blackberry, pine, and black pepper.",
    imageUrl: null,
    priceCents: 5200,
    compareAtPriceCents: 6200,
    sku: "FL-NBLM-35",
    inventory: 84,
    isPublished: true,
    categorySlug: "flower",
  },
  {
    name: "Sunfire Diesel Pre-Roll 1g",
    slug: "sunfire-diesel-pre-roll-1g",
    description:
      "Sativa-leaning pre-roll with citrus fuel aromatics and a bright daytime lift.",
    imageUrl: null,
    priceCents: 1500,
    compareAtPriceCents: 1800,
    sku: "PR-SNFD-1G",
    inventory: 160,
    isPublished: true,
    categorySlug: "pre-rolls",
  },
  {
    name: "Moonmint Live Resin Cartridge 1g",
    slug: "moonmint-live-resin-cartridge-1g",
    description:
      "Ceramic-coil 1g cart featuring mint-forward live resin and clean, potent vapor.",
    imageUrl: null,
    priceCents: 4800,
    compareAtPriceCents: 5600,
    sku: "VP-MNMT-1G",
    inventory: 112,
    isPublished: true,
    categorySlug: "vapes",
  },
  {
    name: "Blood Orange Lift Gummies 100mg",
    slug: "blood-orange-lift-gummies-100mg",
    description:
      "Fast-acting citrus gummies dosed at 10mg THC each for social sessions and creative flow.",
    imageUrl: null,
    priceCents: 3000,
    compareAtPriceCents: 3600,
    sku: "ED-BORG-100",
    inventory: 190,
    isPublished: true,
    categorySlug: "edibles",
  },
  {
    name: "Reaper Rosin Badder 1g",
    slug: "reaper-rosin-badder-1g",
    description:
      "Cold-cured solventless rosin badder with layered fruit funk and heavy body effects.",
    imageUrl: null,
    priceCents: 6500,
    compareAtPriceCents: 7200,
    sku: "CN-RSBN-1G",
    inventory: 74,
    isPublished: true,
    categorySlug: "concentrates",
  },
  {
    name: "Lavender Dream CBN Gummies 100mg",
    slug: "lavender-dream-cbn-gummies-100mg",
    description:
      "Nighttime gummy blend with THC + CBN for a smooth wind-down and deeper sleep routine.",
    imageUrl: null,
    priceCents: 3400,
    compareAtPriceCents: 3900,
    sku: "ED-LVDR-100",
    inventory: 140,
    isPublished: true,
    categorySlug: "edibles",
  },
  {
    name: "Citrus Haze Mini Pre-Roll 5-Pack",
    slug: "citrus-haze-mini-pre-roll-5-pack",
    description:
      "Five mini pre-rolls packed with tangy daytime flower for easy dosing on the move.",
    imageUrl: null,
    priceCents: 2800,
    compareAtPriceCents: 3200,
    sku: "PR-CTHZ-5P",
    inventory: 150,
    isPublished: true,
    categorySlug: "pre-rolls",
  },
  {
    name: "Glacier Press Rosin Vape 0.5g",
    slug: "glacier-press-rosin-vape-0-5g",
    description:
      "Solventless 0.5g rosin vape with crisp terpene preservation and smooth cloud production.",
    imageUrl: null,
    priceCents: 3900,
    compareAtPriceCents: 4500,
    sku: "VP-GLPR-05",
    inventory: 96,
    isPublished: true,
    categorySlug: "vapes",
  },
];

const legacyCategorySlugs = ["performance-gear", "workspace", "audio"];

const legacyProductSlugs = [
  "flux-mechanical-keyboard",
  "vector-ultralight-mouse",
  "arc-pro-headphones",
  "orbit-4k-monitor",
  "nimbus-laptop-stand",
  "nova-usb-c-dock",
];

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.product.deleteMany({
    where: {
      slug: {
        in: legacyProductSlugs,
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      slug: {
        in: legacyCategorySlugs,
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
