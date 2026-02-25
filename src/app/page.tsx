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

  const heroSignals = [
    {
      label: "Live Products",
      value: `${featuredProducts.length}`,
      context: "Published in this workspace",
    },
    {
      label: "Categories",
      value: `${latestCategories.length}`,
      context: "Ready for filter testing",
    },
    {
      label: "Template Focus",
      value: "Minimal",
      context: "Clean baseline for UI iteration",
    },
  ];

  const templatePillars = [
    {
      title: "Fast storefront validation",
      copy: "Use this baseline to test browse, search, and checkout behavior without domain-specific constraints.",
    },
    {
      title: "Admin workflow coverage",
      copy: "Product, category, user, and order flows are included for end-to-end internal QA.",
    },
    {
      title: "Design-ready foundation",
      copy: "A neutral visual system makes it easy to branch into brand-specific themes later.",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="rb-panel rb-fade-up p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="space-y-4">
            <p className="rb-chip">Ecom Template | In-House Testing</p>
            <h1 className="rb-title text-3xl leading-tight md:text-5xl">
              Clean ecommerce template
              <br className="hidden md:block" />
              for product and flow testing.
            </h1>
            <p className="max-w-2xl text-sm text-[var(--rb-muted)] md:text-base">
              This storefront is intentionally generic so your team can validate UX, admin operations,
              and checkout behavior before applying final brand direction.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/products" className="rb-btn">
                Browse Products
              </Link>
              <Link href="/admin" className="rb-btn-secondary">
                Open Admin
              </Link>
            </div>
          </div>

          <div className="rb-panel-soft p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rb-muted)]">
              Snapshot
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {heroSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-[rgba(47,111,237,0.18)] bg-[rgba(255,255,255,0.75)] p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--rb-muted)]">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--rb-text)]">{signal.value}</p>
                  <p className="text-[11px] text-[var(--rb-muted)]">{signal.context}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {templatePillars.map((pillar, index) => (
          <article
            key={pillar.title}
            className={`rb-panel-soft rb-fade-up p-4 transition hover:-translate-y-0.5 ${
              index === 0 ? "rb-delay-1" : index === 1 ? "rb-delay-2" : "rb-delay-3"
            }`}
          >
            <h3 className="text-xl text-[var(--rb-text)]">{pillar.title}</h3>
            <p className="mt-2 text-sm text-[var(--rb-muted)]">{pillar.copy}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--rb-muted)]">
              01 / Product Grid
            </p>
            <h2 className="rb-title text-3xl">Featured Products</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rb-accent-strong)] hover:opacity-85"
          >
            View all
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="rb-panel p-6 text-[var(--rb-muted)]">No products are published yet.</p>
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
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--rb-muted)]">
            02 / Category Navigation
          </p>
          <h2 className="rb-title text-3xl">Explore Categories</h2>
        </div>

        {latestCategories.length === 0 ? (
          <p className="rb-panel p-6 text-[var(--rb-muted)]">No categories available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rb-panel-soft rb-fade-up rb-delay-2 p-5 transition hover:-translate-y-0.5 hover:border-[rgba(47,111,237,0.35)]"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--rb-muted)]">Category</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--rb-text)]">{category.name}</h3>
                <p className="mt-2 text-sm text-[var(--rb-muted)]">
                  {category.description ?? "Explore products in this category."}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
