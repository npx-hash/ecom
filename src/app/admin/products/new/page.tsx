import Link from "next/link";

import { createProductAction } from "@/actions/admin-actions";
import { prisma } from "@/lib/prisma";

type AdminNewProductPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminNewProductPage({
  searchParams,
}: AdminNewProductPageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const errorMessage = params.error?.toString().trim();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Create product</h2>
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
        action={createProductAction}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
              Product name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="slug">
              Slug (optional)
            </label>
            <input
              id="slug"
              name="slug"
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
            rows={5}
            required
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
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-slate-500">
            You can also upload an image file below. Uploaded file takes precedence.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="image">
            Upload image (optional)
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
          <input type="checkbox" name="isPublished" className="size-4" />
          Publish product immediately
        </label>

        <div>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Create product
          </button>
        </div>
      </form>
    </div>
  );
}
