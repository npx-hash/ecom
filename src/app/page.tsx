import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const heroSignals = [
    { label: "Average Fulfillment", value: "42 min" },
    { label: "Returning Members", value: "68%" },
    { label: "Live Inventory Sync", value: "<60 sec" },
  ];

  const dispatchPulse = [
    {
      lane: "North Loop",
      eta: "ETA 24m",
      product: "Sour Nova | 18 units live",
    },
    {
      lane: "Riverfront",
      eta: "ETA 31m",
      product: "Velvet Hash | 12 units live",
    },
    {
      lane: "West District",
      eta: "ETA 27m",
      product: "Citrus Resin | 16 units live",
    },
  ];

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
      <section className="rb-panel rb-fade-up relative overflow-hidden p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(174,224,114,0.22)_0%,_rgba(174,224,114,0)_72%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(174,224,114,0.14)_0%,_transparent_42%,_rgba(174,224,114,0.08)_100%)] opacity-75"
        />

        <div className="relative grid gap-6 md:grid-cols-[1.35fr_1fr]">
          <div className="space-y-4">
            <p className="rb-chip">Reaper Botany | Licensed Dispensary</p>
            <h1 className="rb-title text-3xl leading-tight md:text-5xl">
              Modern cannabis retail,
              <br className="hidden md:block" />
              tuned for drops and reorders.
            </h1>
            <p className="max-w-2xl text-sm text-[#b3c8ab] md:text-base">
              Reaper Botany is a direct-to-consumer storefront built for high-intent browsing,
              curated bundles, and reliable local fulfillment without the generic marketplace feel.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/products" className="rb-btn">
                Shop Strains
              </Link>
              <Link href="/admin" className="rb-btn-secondary">
                Admin Control Room
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-[rgba(174,224,114,0.24)] bg-[rgba(10,19,13,0.78)] p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#95ad8f]">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#e8f5d6]">{signal.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rb-panel-soft rb-fade-up rb-delay-1 p-4 md:p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#b3c8ab]">Dispatch Pulse</p>
            <div className="mt-3 space-y-2.5">
              {dispatchPulse.map((item) => (
                <div
                  key={item.lane}
                  className="rounded-xl border border-[rgba(174,224,114,0.2)] bg-[rgba(8,15,10,0.78)] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#b7caa8]">{item.lane}</p>
                    <p className="font-mono text-[11px] text-[#dff5be]">{item.eta}</p>
                  </div>
                  <p className="mt-1 text-xs text-[#97b18f]">{item.product}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#8ea88b]">
              Built for fast rotation, clean merchandising, and repeat buyers.
            </p>
          </div>
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
