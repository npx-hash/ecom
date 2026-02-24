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
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-[420px] w-full bg-gradient-to-tr from-slate-200 to-slate-100" />
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.category?.name ?? "Uncategorized"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
        </div>

        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-slate-900">{formatPrice(product.priceCents)}</p>
          {product.compareAtPriceCents ? (
            <p className="text-lg text-slate-500 line-through">
              {formatPrice(product.compareAtPriceCents)}
            </p>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {product.description}
        </p>

        <p className="text-sm font-medium text-slate-700">
          SKU: <span className="font-mono">{product.sku}</span>
        </p>
        <p className="text-sm font-medium text-slate-700">
          {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
        </p>

        {errorMessage ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {product.inventory > 0 ? (
          <form action={addToCartAction} className="space-y-3 rounded-xl border border-slate-200 p-4">
            <input type="hidden" name="productId" value={product.id} />
            <label className="block text-sm font-medium text-slate-700" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              max={product.inventory}
              defaultValue={1}
              className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
            />
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Add to cart
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This product is currently out of stock.
          </div>
        )}
      </div>
    </div>
  );
}
