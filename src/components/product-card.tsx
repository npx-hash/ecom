import type { Product } from "@prisma/client";
import Link from "next/link";

import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Pick<
    Product,
    | "id"
    | "name"
    | "slug"
    | "description"
    | "imageUrl"
    | "priceCents"
    | "compareAtPriceCents"
    | "inventory"
  > & {
    category?: {
      name: string;
      slug: string;
    } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const stockStatus =
    product.inventory > 24 ? "In stock" : product.inventory > 0 ? "Low stock" : "Sold out";

  return (
    <article className="group rb-panel rb-fade-up relative overflow-hidden transition duration-300 hover:-translate-y-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(47,111,237,0.45)] to-transparent"
      />

      <div className="relative">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="h-52 w-full bg-gradient-to-tr from-[#dfe9ff] to-[#f6f9ff]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(12,28,58,0.46)] via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rb-badge !bg-[rgba(255,255,255,0.75)]">Catalog</span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rb-muted)]">
            {product.category?.name ?? "Uncategorized"}
          </p>
          <h3 className="text-xl font-semibold text-[var(--rb-text)]">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-[var(--rb-muted)]">{product.description}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-[var(--rb-accent-strong)]">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtPriceCents ? (
            <span className="text-sm text-[#7a8da8] line-through">
              {formatPrice(product.compareAtPriceCents)}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <p className="font-medium text-[var(--rb-muted)]">{stockStatus}</p>
            <p className="font-mono text-[#7a8da8]">
              {product.inventory > 0 ? `${product.inventory} available` : "Restock soon"}
            </p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(47,111,237,0.12)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3576f1] to-[#79a3ff]"
              style={{
                width: `${Math.max(10, Math.min(100, product.inventory * 4))}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-medium text-[var(--rb-muted)]">
            {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
          </p>
          <Link href={`/products/${product.slug}`} className="rb-btn !px-3 !py-1.5 !text-[10px]">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
