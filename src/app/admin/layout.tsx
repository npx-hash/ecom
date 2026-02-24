import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin("/admin");

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage catalog, inventory, users, orders, and publishing state.
        </p>
        <div className="mt-4">
          <AdminNav />
        </div>
      </header>
      {children}
    </div>
  );
}
