import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    error?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const activeCategory = params.category?.toString().trim();
  const query = params.q?.toString().trim();
  const errorMessage = params.error?.toString().trim();

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.product.findMany({
      where: {
        isPublished: true,
        ...(activeCategory
          ? {
              category: {
                slug: activeCategory,
              },
            }
          : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { description: { contains: query } },
                { sku: { contains: query } },
              ],
            }
          : {}),
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const quickSignals = [
    {
      label: "Results",
      value: `${products.length}`,
      context: activeCategory ? "Category filtered" : "All published products",
    },
    {
      label: "Categories",
      value: `${categories.length}`,
      context: "Available for filter testing",
    },
    {
      label: "Search",
      value: query ? "Active" : "Idle",
      context: query ? `\"${query}\"` : "No query set",
    },
  ];

  const featuredCategoryTags = categories.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rb-panel rb-fade-up p-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="rb-chip">Catalog</p>
            <h1 className="rb-title text-4xl">Browse Products</h1>
            <p className="text-sm text-[var(--rb-muted)]">
              Filter by category, search by keyword or SKU, and validate catalog behavior across
              different merchandising scenarios.
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredCategoryTags.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="rounded-full border border-[rgba(47,111,237,0.2)] bg-[rgba(255,255,255,0.75)] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--rb-muted)] transition hover:border-[rgba(47,111,237,0.4)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="rb-panel-soft p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--rb-muted)]">
              Catalog Snapshot
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {quickSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-[rgba(47,111,237,0.16)] bg-[rgba(255,255,255,0.78)] p-3"
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

        {errorMessage ? <p className="rb-alert mt-4">{errorMessage}</p> : null}

        <form className="mt-5 grid gap-3 rounded-2xl border border-[rgba(47,111,237,0.16)] bg-[rgba(255,255,255,0.64)] p-3 md:grid-cols-[1fr_220px_auto] md:p-4">
          <input
            type="text"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search products, categories, or SKU"
            className="rb-input"
          />
          <select name="category" defaultValue={activeCategory ?? ""} className="rb-select">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="rb-btn">
            Apply
          </button>
        </form>

        {(activeCategory || query) && (
          <div className="mt-4 flex items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--rb-muted)]">
              Filters active
            </p>
            <Link
              href="/products"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rb-accent-strong)] hover:opacity-85"
            >
              Clear filters
            </Link>
          </div>
        )}
      </section>

      {products.length === 0 ? (
        <div className="rb-panel p-8 text-center text-[var(--rb-muted)]">
          No products match this filter.
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
}
