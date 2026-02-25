import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [usersCount, productsCount, publishedProductsCount, ordersCount, revenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({
        where: { isPublished: true },
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalCents: true,
        },
      }),
    ]);

  const stats = [
    { label: "Total users", value: usersCount.toString() },
    { label: "Products", value: productsCount.toString() },
    { label: "Published products", value: publishedProductsCount.toString() },
    { label: "Orders", value: ordersCount.toString() },
    {
      label: "Gross revenue",
      value: formatPrice(revenue._sum.totalCents ?? 0),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <article key={stat.label} className="rb-panel-soft p-4">
            <p className="text-sm text-[var(--rb-muted)]">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--rb-accent-strong)]">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="rb-panel-soft p-5 transition hover:-translate-y-0.5 hover:border-[rgba(47,111,237,0.35)]"
        >
          <h2 className="text-lg font-semibold text-[var(--rb-text)]">Create product</h2>
          <p className="mt-2 text-sm text-[var(--rb-muted)]">
            Add new SKUs, upload images, and publish products.
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="rb-panel-soft p-5 transition hover:-translate-y-0.5 hover:border-[rgba(47,111,237,0.35)]"
        >
          <h2 className="text-lg font-semibold text-[var(--rb-text)]">Manage orders</h2>
          <p className="mt-2 text-sm text-[var(--rb-muted)]">
            Update fulfillment statuses from pending to delivered.
          </p>
        </Link>
      </section>
    </div>
  );
}

