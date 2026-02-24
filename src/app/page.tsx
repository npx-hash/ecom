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
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <p className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
            Full stack ecommerce platform
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Launch and scale your store with customer and admin experiences in one app.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            This build ships user auth, product catalog, cart and checkout, and a role-based admin dashboard to manage products, categories, orders, and users.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Start Shopping
            </Link>
            <Link
              href="/admin"
              className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-6 text-white">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-100">
            Included
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>Account registration and secure login</li>
            <li>Published product catalog and detail pages</li>
            <li>Persistent cart and transactional checkout</li>
            <li>Order status lifecycle managed by admins</li>
            <li>Image URL or direct image upload for products</li>
            <li>Role-based user administration</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Featured products</h2>
          <Link href="/products" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            View all
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
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
        <h2 className="text-2xl font-semibold text-slate-900">Shop by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {category.description ?? "Explore this category"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
