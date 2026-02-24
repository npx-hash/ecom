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
    <article className="group rb-panel rb-fade-up overflow-hidden">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="h-52 w-full bg-gradient-to-tr from-[#1a2a1c] to-[#0d1710]" />
      )}

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9ab194]">
            {product.category?.name ?? "Uncategorized"}
          </p>
          <h3 className="text-xl font-semibold text-[#edf5dd]">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-[#a5bc9f]">{product.description}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-[#daf4b4]">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtPriceCents ? (
            <span className="text-sm text-[#7f927c] line-through">
              {formatPrice(product.compareAtPriceCents)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#8ea88b]">
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
