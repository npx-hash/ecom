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
      <header className="rb-panel p-6">
        <p className="rb-chip">Control Room</p>
        <h1 className="rb-title mt-4 text-4xl text-[#edf5dd]">Admin dashboard</h1>
        <p className="mt-2 text-sm text-[#a7bc9f]">
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
