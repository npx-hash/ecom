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
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-48 w-full bg-gradient-to-tr from-slate-200 to-slate-100" />
      )}

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.category?.name ?? "Uncategorized"}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-slate-900">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtPriceCents ? (
            <span className="text-sm text-slate-500 line-through">
              {formatPrice(product.compareAtPriceCents)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500">
            {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
