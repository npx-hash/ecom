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

  return (
    <div className="space-y-8">
      <section className="rb-panel rb-fade-up p-6">
        <p className="rb-chip">Dispensary Catalog</p>
        <h1 className="rb-title mt-4 text-4xl text-[#edf5dd]">Shop Reaper Botany</h1>
        <p className="mt-2 text-sm text-[#a7bc9f]">
          Browse live products, filter by collection, and search by strain, SKU, or descriptor.
        </p>
        {errorMessage ? (
          <p className="rb-alert mt-4">
            {errorMessage}
          </p>
        ) : null}

        <form className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input
            type="text"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search products"
            className="rb-input"
          />
          <select
            name="category"
            defaultValue={activeCategory ?? ""}
            className="rb-select"
          >
            <option value="">All categories</option>
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
          <div className="mt-4">
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
