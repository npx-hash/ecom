import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/actions/admin-actions";
import { formatDateTime, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type AdminEditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminEditProductPage({
  params,
  searchParams,
}: AdminEditProductPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const errorMessage = query.error?.toString().trim();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Edit product</h2>
        <Link href="/admin/products" className="text-sm font-medium text-slate-700 hover:text-slate-900">
          Back to products
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={updateProductAction}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="existingImageUrl" value={product.imageUrl ?? ""} />

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          Created {formatDateTime(product.createdAt)} | Last updated {formatDateTime(product.updatedAt)}
          <br />
          Current price: {formatPrice(product.priceCents)} | SKU:{" "}
          <span className="font-mono">{product.sku}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
              Product name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={product.name}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={product.slug}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            defaultValue={product.description}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="price">
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={(product.priceCents / 100).toFixed(2)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="compareAtPrice"
            >
              Compare-at price
            </label>
            <input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={
                product.compareAtPriceCents
                  ? (product.compareAtPriceCents / 100).toFixed(2)
                  : ""
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="inventory">
              Inventory
            </label>
            <input
              id="inventory"
              name="inventory"
              type="number"
              min={0}
              required
              defaultValue={product.inventory}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="sku">
              SKU
            </label>
            <input
              id="sku"
              name="sku"
              required
              defaultValue={product.sku}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="categoryId">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={product.categoryId ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={product.imageUrl ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="image">
            Upload replacement image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={product.isPublished}
            className="size-4"
          />
          Published
        </label>

        <div>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
