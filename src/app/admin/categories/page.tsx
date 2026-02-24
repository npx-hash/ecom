import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin-actions";
import { prisma } from "@/lib/prisma";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const errorMessage = params.error?.toString().trim();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create category</h2>
        {errorMessage ? (
          <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}
        <form action={createCategoryAction} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            name="name"
            placeholder="Name"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="slug"
            placeholder="Slug (optional)"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Add category
          </button>
          <textarea
            name="description"
            rows={2}
            placeholder="Description (optional)"
            className="sm:col-span-3 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Existing categories</h2>
        {categories.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            No categories yet.
          </p>
        ) : (
          categories.map((category) => (
            <article
              key={category.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <form action={updateCategoryAction} className="contents">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    name="slug"
                    defaultValue={category.slug}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                    >
                      Save
                    </button>
                  </div>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={category.description ?? ""}
                    className="sm:col-span-3 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </form>
              </div>
              <form action={deleteCategoryAction} className="mt-2">
                <input type="hidden" name="categoryId" value={category.id} />
                <button
                  type="submit"
                  className="rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                >
                  Delete
                </button>
              </form>
              <p className="mt-2 text-xs text-slate-500">
                {category._count.products} products assigned
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
