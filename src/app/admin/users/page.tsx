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
      <h2 className="rb-title text-3xl text-[#edf5dd]">Users</h2>
      {errorMessage ? (
        <p className="rb-alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="rb-table-wrap">
        <table className="rb-table">
          <thead>
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-[#edf5dd]">{user.name}</td>
                <td className="px-4 py-3 text-[#c0d1b8]">{user.email}</td>
                <td className="px-4 py-3 text-[#96ac91]">{formatDateTime(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rb-badge ${
                      user.role === "ADMIN"
                        ? "!border-[rgba(130,193,255,0.45)] !bg-[rgba(130,193,255,0.13)] !text-[#c7e8ff]"
                        : ""
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
                      className="rb-select !w-auto !py-1.5 !text-xs"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button type="submit" className="rb-btn-secondary !py-1.5 !text-[10px]">
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
