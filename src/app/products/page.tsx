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
      label: "Live SKUs",
      value: `${products.length}`,
      context: activeCategory ? "Filtered view" : "Full catalog",
    },
    {
      label: "Collections",
      value: `${categories.length}`,
      context: "Category indexed",
    },
    {
      label: "Search",
      value: query ? "Targeted" : "Open",
      context: query ? `"${query}"` : "No query applied",
    },
  ];

  const featuredCategoryTags = categories.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rb-panel rb-fade-up p-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="rb-chip">Dispensary Catalog</p>
            <h1 className="rb-title text-4xl text-[#edf5dd]">Shop Reaper Botany</h1>
            <p className="text-sm text-[#a7bc9f]">
              Browse live products, filter by collection, and search by strain, SKU, or descriptor.
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredCategoryTags.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="rounded-full border border-[rgba(174,224,114,0.24)] bg-[rgba(9,17,11,0.72)] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#c4dbb3] transition hover:border-[rgba(174,224,114,0.44)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="rb-panel-soft p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#a8bf9d]">Catalog Pulse</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {quickSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-[rgba(174,224,114,0.2)] bg-[rgba(8,15,10,0.74)] p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#94ad8d]">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#e8f6d4]">{signal.value}</p>
                  <p className="text-[11px] text-[#8ea688]">{signal.context}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errorMessage ? (
          <p className="rb-alert mt-4">
            {errorMessage}
          </p>
        ) : null}

        <form className="mt-5 grid gap-3 rounded-2xl border border-[rgba(174,224,114,0.18)] bg-[rgba(8,16,10,0.56)] p-3 md:grid-cols-[1fr_220px_auto] md:p-4">
          <input
            type="text"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search strains, vapes, or edibles"
            className="rb-input"
          />
          <select
            name="category"
            defaultValue={activeCategory ?? ""}
            className="rb-select"
          >
            <option value="">All cannabis categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rb-btn"
          >
            Apply
          </button>
        </form>

        {(activeCategory || query) && (
          <div className="mt-4 flex items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8ca684]">
              Filters active
            </p>
            <Link
              href="/products"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b2c7aa] hover:text-[#e7f6d2]"
            >
              Clear filters
            </Link>
          </div>
        )}
      </section>

      {products.length === 0 ? (
        <div className="rb-panel p-8 text-center text-[#a5bc9f]">
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
