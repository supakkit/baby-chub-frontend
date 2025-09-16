// src/views/admin/AdminUsers.jsx
import { useEffect, useMemo, useState } from "react";
import Drawer from "../../components/Drawer";
import {
  listAdminUsers,
  getAdminUserById,
  updateUserRole,
  resendUserVerification,
  deleteUserById,
} from "../../services/adminUserServices";

function useDebouncedValue(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function AdminUsers() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState(""); // "", "1", "0"
  const qDebounced = useDebouncedValue((query || "").trim(), 300);

  const [page, setPage] = useState(1);
  const limit = 20;

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: limit,
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // filter เปลี่ยน -> กลับหน้า 1
  useEffect(() => {
    setPage(1);
  }, [qDebounced, role, verified]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrorMsg("");
    listAdminUsers({ query: qDebounced, role, verified, page, limit })
      .then((d) => mounted && setData(d))
      .catch((e) => {
        if (!mounted) return;
        console.error(e);
        setErrorMsg(
          e?.response?.data?.message || e.message || "Failed to load users"
        );
        setData({ items: [], total: 0, page: 1, pageSize: limit });
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [qDebounced, role, verified, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data.total || 0) / limit)),
    [data.total]
  );

  async function onView(id) {
    setOpen(true);
    setLoadingDetail(true);
    setDetail(null);
    try {
      const d = await getAdminUserById(id);
      setDetail(d);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to load user detail");
      setOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function onToggleRole(id, currentRole) {
    const next = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(id, next);
      setData((d) => ({
        ...d,
        items: d.items.map((u) => (u.id === id ? { ...u, role: next } : u)),
      }));
      setDetail((prev) => (prev?.id === id ? { ...prev, role: next } : prev));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update role");
    }
  }

  async function onResendVerify(id) {
    try {
      await resendUserVerification(id);
      alert("Verification email sent.");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to resend verification");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUserById(id);
      setData((d) => ({
        ...d,
        items: d.items.filter((u) => u.id !== id),
        total: Math.max(0, (d.total || 0) - 1),
      }));
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete user");
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
          placeholder="Search name/email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
            if (e.key === "Enter") setPage(1);
          }}
        />
        <select
          className="h-10 px-3 rounded-md border"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          className="h-10 px-3 rounded-md border"
          value={verified}
          onChange={(e) => setVerified(e.target.value)}
        >
          <option value="">All verifications</option>
          <option value="1">Verified</option>
          <option value="0">Unverified</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[color:var(--muted-foreground)]">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Verified</th>
              <th className="py-2 px-3">Orders</th>
              <th className="py-2 px-3">Created</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : errorMsg ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-red-600">
                  {errorMsg}
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  No users
                </td>
              </tr>
            ) : (
              data.items.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-[color:var(--border)]"
                >
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.role}</td>
                  <td className="py-2 px-3">{u.verified ? "Yes" : "No"}</td>
                  <td className="py-2 px-3">{u.orders}</td>
                  <td className="py-2 px-3">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("th-TH")
                      : "-"}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                      <button
                        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
                        onClick={() => onView(u.id)}
                        title="View user details"
                        aria-label="View user details"
                      >
                        View
                      </button>
                      <button
                        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
                        onClick={() => onToggleRole(u.id, u.role)}
                        title="Toggle between Admin and User role"
                        aria-label="Toggle role"
                      >
                        Toggle role
                      </button>
                      <button
                        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
                        onClick={() => onResendVerify(u.id)}
                        title="Resend verification email to this user"
                        aria-label="Resend verification"
                      >
                        Resend verify
                      </button>
                      <button
                        className="h-9 px-3 rounded-md border hover:bg-red-500/10"
                        onClick={() => onDelete(u.id)}
                        title="Delete this user permanently"
                        aria-label="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          className="h-9 px-3 rounded-md border"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          title="Go to previous page"
          aria-label="Previous page"
        >
          Prev
        </button>
        <div className="text-sm">
          Page {page} / {totalPages}
        </div>
        <button
          className="h-9 px-3 rounded-md border"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          title="Go to next page"
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      {/* Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)} title="User details">
        {loadingDetail || !detail ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-[color:var(--muted)]/40 rounded" />
            <div className="h-4 bg-[color:var(--muted)]/30 rounded w-2/3" />
            <div className="h-28 bg-[color:var(--muted)]/20 rounded" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Name:</span> {detail.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {detail.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {detail.role}
            </div>
            <div>
              <span className="font-medium">Verified:</span>{" "}
              {detail.verified ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Orders:</span> {detail.ordersCount}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {detail.createdAt
                ? new Date(detail.createdAt).toLocaleString("th-TH")
                : "-"}
            </div>
            <div>
              <span className="font-medium">Last login:</span>{" "}
              {detail.lastLogin
                ? new Date(detail.lastLogin).toLocaleString("th-TH")
                : "-"}
            </div>
            {Array.isArray(detail.addresses) && detail.addresses.length > 0 && (
              <div>
                <span className="font-medium">Addresses:</span>
                <ul className="list-disc pl-5">
                  {detail.addresses.map((a, i) => (
                    <li key={i}>
                      {a.label}: {a.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detail.notes && (
              <div>
                <span className="font-medium">Notes:</span> {detail.notes}
              </div>
            )}
            <div className="pt-3 flex gap-2">
              <button
                className="h-9 px-3 rounded-md border"
                onClick={() => onToggleRole(detail.id, detail.role)}
                title="Toggle between Admin and User role"
                aria-label="Toggle role"
              >
                Toggle role
              </button>
              <button
                className="h-9 px-3 rounded-md border"
                onClick={() => onResendVerify(detail.id)}
                title="Resend verification email to this user"
                aria-label="Resend verification"
              >
                Resend verify
              </button>
              <button
                className="h-9 px-3 rounded-md border hover:bg-red-500/10"
                onClick={() => onDelete(detail.id)}
                title="Delete this user permanently"
                aria-label="Delete user"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
