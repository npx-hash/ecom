import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const heroSignals = [
    {
      label: "Average Fulfillment",
      value: "42 min",
      context: "Across active city zones",
    },
    {
      label: "Returning Members",
      value: "68%",
      context: "30-day cohort",
    },
    {
      label: "Inventory Sync",
      value: "<60 sec",
      context: "Catalog to checkout",
    },
  ];

  const dispatchPulse = [
    {
      lane: "North Loop",
      eta: "ETA 24m",
      product: "Sour Nova",
      stock: "18 units live",
    },
    {
      lane: "Riverfront",
      eta: "ETA 31m",
      product: "Velvet Hash",
      stock: "12 units live",
    },
    {
      lane: "West District",
      eta: "ETA 27m",
      product: "Citrus Resin",
      stock: "16 units live",
    },
  ];

  const launchTags = [
    "Same-day city delivery",
    "Image-first product storytelling",
    "Reorder memory + account history",
  ];

  const experiencePillars = [
    {
      label: "Visual Commerce",
      title: "Editorial product surfaces over generic grids.",
      copy: "Merchandising tuned for discovery and premium positioning.",
    },
    {
      label: "Operational Speed",
      title: "Inventory and dispatch context in one system view.",
      copy: "Built for quick rotations without sacrificing brand clarity.",
    },
    {
      label: "Retention Loop",
      title: "Designed for repeat members, drops, and loyalty.",
      copy: "Consistent UX from first browse through repeat checkout.",
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
  const leadCategory = latestCategories[0]?.name ?? "New Collection";
  const leadProduct = featuredProducts[0]?.name ?? "Signature Flower";

  return (
    <div className="space-y-12">
      <section className="rb-panel rb-fade-up relative overflow-hidden p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(174,224,114,0.3)_0%,_rgba(174,224,114,0)_70%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,_rgba(174,224,114,0.18)_0%,_transparent_36%,_rgba(174,224,114,0.1)_100%)] opacity-80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] top-0 h-px bg-gradient-to-r from-transparent via-[rgba(174,224,114,0.65)] to-transparent"
        />

        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="space-y-5">
            <p className="rb-chip">Reaper Botany | Licensed Dispensary</p>
            <h1 className="rb-title text-3xl leading-tight md:text-5xl">
              Modern cannabis retail,
              <br className="hidden md:block" />
              tuned for drops and repeat velocity.
            </h1>
            <p className="max-w-2xl text-sm text-[#b3c8ab] md:text-base">
              Reaper Botany is a direct-to-consumer storefront built for high-intent browsing,
              curated bundles, and reliable local fulfillment with a brand-led interface.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/products" className="rb-btn">
                Shop Strains
              </Link>
              <Link href="/admin" className="rb-btn-secondary">
                Admin Control Room
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {launchTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[rgba(174,224,114,0.24)] bg-[rgba(10,19,13,0.7)] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#c5ddb5]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-[rgba(174,224,114,0.24)] bg-[linear-gradient(160deg,_rgba(12,22,15,0.9)_0%,_rgba(8,15,10,0.82)_100%)] p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#95ad8f]">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#e8f5d6]">{signal.value}</p>
                  <p className="mt-1 text-[11px] text-[#8da687]">{signal.context}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-3">
            <div className="rb-hero-radar rb-fade-up rb-delay-1 p-4 md:p-5">
              <div aria-hidden className="rb-hero-scan" />
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#afc59d]">Market Lens</p>
              <p className="mt-2 text-3xl font-semibold text-[#eff8dd]">{leadCategory}</p>
              <p className="mt-1 text-sm text-[#a6bf9f]">Current pull centers on {leadProduct}.</p>
              <div className="mt-4 space-y-2 font-mono text-[11px] text-[#d9efbd]">
                <div className="flex items-center justify-between rounded-lg border border-[rgba(174,224,114,0.24)] bg-[rgba(8,15,10,0.7)] px-2.5 py-2">
                  <span>Peak ordering</span>
                  <span>18:00-22:00</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[rgba(174,224,114,0.24)] bg-[rgba(8,15,10,0.7)] px-2.5 py-2">
                  <span>SKU volatility</span>
                  <span>Medium</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[rgba(174,224,114,0.24)] bg-[rgba(8,15,10,0.7)] px-2.5 py-2">
                  <span>New member lift</span>
                  <span>+14%</span>
                </div>
              </div>
            </div>

            <div className="rb-panel-soft rb-fade-up rb-delay-2 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#b3c8ab]">Dispatch Pulse</p>
              <div className="mt-3 space-y-2.5">
                {dispatchPulse.map((item) => (
                  <div key={item.lane} className="relative pl-4">
                    <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-[#aee072]" />
                    <div className="rounded-xl border border-[rgba(174,224,114,0.2)] bg-[rgba(8,15,10,0.78)] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-[#b7caa8]">
                          {item.lane}
                        </p>
                        <p className="font-mono text-[11px] text-[#dff5be]">{item.eta}</p>
                      </div>
                      <p className="mt-1 text-xs text-[#a3b99d]">{item.product}</p>
                      <p className="mt-0.5 text-[11px] text-[#86a381]">{item.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {experiencePillars.map((pillar, index) => (
          <article
            key={pillar.label}
            className={`rb-panel-soft rb-fade-up p-4 transition hover:-translate-y-0.5 ${
              index === 0 ? "rb-delay-1" : index === 1 ? "rb-delay-2" : "rb-delay-3"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#93ad8e]">{pillar.label}</p>
            <h3 className="mt-2 text-xl text-[#ecf5dd]">{pillar.title}</h3>
            <p className="mt-2 text-sm text-[#a7bd9f]">{pillar.copy}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8aa482]">
              01 / Curated Product Layer
            </p>
            <h2 className="rb-title text-3xl text-[#edf5dd]">Featured Drops</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b2c7aa] hover:text-[#e7f6d2]"
          >
            View all
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="rb-panel p-6 text-[#a5bc9f]">No products are published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8aa482]">
            02 / Collection Navigation
          </p>
          <h2 className="rb-title text-3xl text-[#edf5dd]">Explore by Collection</h2>
        </div>
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
