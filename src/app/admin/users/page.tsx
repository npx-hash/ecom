import { updateUserRoleAction } from "@/actions/admin-actions";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type AdminUsersPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const [params, users] = await Promise.all([
    searchParams,
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const errorMessage = params.error?.toString().trim();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
      {errorMessage ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-700">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={updateUserRoleAction} className="flex justify-end gap-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-semibold"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
