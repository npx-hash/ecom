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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Catalog</h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse all published products. Filter by category or search by keyword.
        </p>
        {errorMessage ? (
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <form className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input
            type="text"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search products"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
          />
          <select
            name="category"
            defaultValue={activeCategory ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
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
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Apply
          </button>
        </form>

        {(activeCategory || query) && (
          <div className="mt-4">
            <Link href="/products" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Clear filters
            </Link>
          </div>
        )}
      </section>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
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
