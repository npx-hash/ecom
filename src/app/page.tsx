import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featuredProducts, latestCategories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-12">
      <section className="rb-panel rb-fade-up grid gap-8 overflow-hidden p-8 md:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <p className="rb-chip">Reaper Botany | Licensed Dispensary</p>
          <h1 className="rb-title text-4xl leading-tight md:text-6xl">
            Deep-cut flower.
            <br />
            Clean concentrates.
            <br />
            Brand-first cannabis commerce.
          </h1>
          <p className="max-w-2xl text-base text-[#a3b99f] md:text-lg">
            Reaper Botany is your direct-to-consumer storefront for premium drops, curated bundles,
            and reliable local fulfillment. Built to feel like a real lifestyle brand, not a generic
            marketplace.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products" className="rb-btn">
              Shop Strains
            </Link>
            <Link href="/admin" className="rb-btn-secondary">
              Admin Control Room
            </Link>
          </div>
        </div>
        <div className="rb-panel-soft rb-fade-up rb-delay-1 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#b3c8ab]">Brand Promise</p>
          <ul className="mt-3 space-y-2.5 text-sm text-[#d9ebcf]">
            <li>Single-brand dispensary experience from browse to delivery.</li>
            <li>Live inventory with curated product presentation.</li>
            <li>Member accounts with order tracking and reorder history.</li>
            <li>Admin control over catalog, imagery, pricing, and statuses.</li>
            <li>Designed for scaling into loyalty, drops, and subscriptions.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="rb-title text-3xl text-[#edf5dd]">Featured Drops</h2>
          <Link href="/products" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b2c7aa] hover:text-[#e7f6d2]">
            View all
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="rb-panel p-6 text-[#a5bc9f]">
            No products are published yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="rb-title text-3xl text-[#edf5dd]">Explore by Collection</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rb-panel-soft rb-fade-up rb-delay-2 p-5 transition hover:-translate-y-0.5 hover:border-[rgba(174,224,114,0.38)]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[#8ea88b]">Collection</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#edf5dd]">{category.name}</h3>
              <p className="mt-2 text-sm text-[#a7bc9f]">
                {category.description ?? "Explore this collection"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
