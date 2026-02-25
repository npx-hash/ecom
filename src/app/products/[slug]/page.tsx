import { notFound } from "next/navigation";

import { addToCartAction } from "@/actions/shop-actions";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const errorMessage = query.error?.toString().trim();

  const product = await prisma.product.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="rb-panel rb-fade-up grid gap-6 p-6 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-[rgba(47,111,237,0.18)] bg-[#edf2ff]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-[420px] w-full bg-gradient-to-tr from-[#dbe7ff] to-[#edf2ff]" />
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rb-muted)]">
            {product.category?.name ?? "Uncategorized"}
          </p>
          <h1 className="rb-title mt-1 text-4xl">{product.name}</h1>
        </div>

        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-[var(--rb-accent-strong)]">
            {formatPrice(product.priceCents)}
          </p>
          {product.compareAtPriceCents ? (
            <p className="text-lg text-[#7a8da8] line-through">
              {formatPrice(product.compareAtPriceCents)}
            </p>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--rb-muted)]">
          {product.description}
        </p>

        <p className="text-sm font-medium text-[var(--rb-muted)]">
          SKU: <span className="font-mono text-[var(--rb-text)]">{product.sku}</span>
        </p>
        <p className="text-sm font-medium text-[var(--rb-muted)]">
          {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
        </p>

        {errorMessage ? (
          <p className="rb-alert">
            {errorMessage}
          </p>
        ) : null}

        {product.inventory > 0 ? (
          <form
            action={addToCartAction}
            className="rb-panel-soft space-y-3 rounded-xl border p-4"
          >
            <input type="hidden" name="productId" value={product.id} />
            <label className="rb-label" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              max={product.inventory}
              defaultValue={1}
              className="rb-input w-28"
            />
            <button type="submit" className="rb-btn">
              Add to cart
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-[rgba(212,88,112,0.32)] bg-[rgba(212,88,112,0.08)] px-4 py-3 text-sm text-[#a1374b]">
            This product is currently out of stock.
          </div>
        )}
      </div>
    </div>
  );
}
