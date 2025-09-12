// src/views/admin/AdminUsers.jsx
import { useEffect, useMemo, useState } from "react";
import Drawer from "../../components/Drawer";


const MOCK = true; // ← BE พร้อมแล้วค่อยเปลี่ยนเป็น false

// --- Mock list & detail ---
function mockUsers(page = 1, limit = 20) {
  const items = Array.from({ length: limit }, (_, i) => {
    const n = (page - 1) * limit + i;
    return {
      id: `u_${n}`,
      name: n % 2 ? "Demo User" : "Jane Doe",
      email: n % 2 ? "demo@babychub.app" : `jane${n}@example.com`,
      role: n % 7 === 0 ? "admin" : "user",
      verified: n % 3 !== 0,
      orders: Math.floor(Math.random() * 12),
      createdAt: new Date(Date.now() - n * 86_400_000).toISOString(),
    };
  });
  return { items, total: 200, page, pageSize: limit };
}
function mockUserDetail(id) {
  return {
    id,
    name: "Demo User",
    email: "demo@babychub.app",
    role: "user",
    verified: true,
    createdAt: "2025-07-12T09:00:00Z",
    lastLogin: "2025-09-10T12:21:00Z",
    ordersCount: 5,
    addresses: [{ label: "Default", detail: "Bangkok, Thailand" }],
    notes: "VIP customer; likes coding courses.",
  };
}

// --- API adapters ---
async function getUsers(params) {
  const { page = 1, limit = 20 } = params || {};
  if (MOCK) return mockUsers(Number(page), Number(limit));
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/admin/users?${qs}`, { credentials: "include" });
  if (!res.ok) throw new Error("Fetch /admin/users failed");
  const data = await res.json();
  // ถ้า schema BE ต่างไป ให้ map ตรงนี้
  return data;
}

async function getUserDetail(id) {
  if (MOCK) return mockUserDetail(id);
  const res = await fetch(`/admin/users/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Fetch /admin/users/:id failed");
  return res.json();
}

async function patchUserRole(id, nextRole) {
  if (MOCK) return new Promise((r) => setTimeout(() => r(true), 250));
  const res = await fetch(`/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role: nextRole }),
  });
  return res.ok;
}

async function resendVerify(id) {
  if (MOCK) return new Promise((r) => setTimeout(() => r(true), 250));
  const res = await fetch(`/admin/users/${id}/resend-verify`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

async function deleteUser(id) {
  if (MOCK) return new Promise((r) => setTimeout(() => r(true), 250));
  const res = await fetch(`/admin/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

// --- Component ---
export default function AdminUsers() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: limit,
  });
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers({ query, role, verified, page, limit })
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [query, role, verified, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data.total || 0) / limit)),
    [data.total]
  );

  const onChangeRole = async (id, current) => {
    const next = current === "admin" ? "user" : "admin";
    const ok = await patchUserRole(id, next);
    if (ok) {
      setData((d) => ({
        ...d,
        items: d.items.map((u) => (u.id === id ? { ...u, role: next } : u)),
      }));
      if (detail?.id === id) setDetail((s) => ({ ...s, role: next })); // sync ใน drawer
    } else {
      alert("Failed to update role");
    }
  };

  const onResend = async (id) => {
    const ok = await resendVerify(id);
    alert(ok ? "Verification email sent." : "Failed to resend email");
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    const ok = await deleteUser(id);
    if (ok) {
      setData((d) => ({
        ...d,
        items: d.items.filter((u) => u.id !== id),
        total: (d.total || 1) - 1,
      }));
      if (detail?.id === id) setOpen(false);
    } else {
      alert("Failed to delete user");
    }
  };

  const onView = async (id) => {
    setSelectedId(id);
    setOpen(true);
    setLoadingDetail(true);
    try {
      const d = await getUserDetail(id);
      setDetail(d);
    } finally {
      setLoadingDetail(false);
    }
  };

  const RowActions = (u) => (
    <div className="flex gap-2">
      <button
        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
        onClick={() => onView(u.id)}
      >
        View
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
        onClick={() => onChangeRole(u.id, u.role)}
      >
        Toggle role
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
        onClick={() => onResend(u.id)}
      >
        Resend verify
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-red-500/10"
        onClick={() => onDelete(u.id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
          placeholder="Search name/email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
                    {new Date(u.createdAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="py-2 px-3">
                    <RowActions {...u} />
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
        >
          Next
        </button>
      </div>

      {/* Drawer: User detail */}
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
              {new Date(detail.createdAt).toLocaleString("th-TH")}
            </div>
            <div>
              <span className="font-medium">Last login:</span>{" "}
              {new Date(detail.lastLogin).toLocaleString("th-TH")}
            </div>
            <div>
              <span className="font-medium">Addresses:</span>
              <ul className="list-disc pl-5">
                {(detail.addresses || []).map((a, i) => (
                  <li key={i}>
                    {a.label}: {a.detail}
                  </li>
                ))}
              </ul>
            </div>
            {detail.notes && (
              <div>
                <span className="font-medium">Notes:</span> {detail.notes}
              </div>
            )}

            <div className="pt-3 flex gap-2">
              <button
                className="h-9 px-3 rounded-md border"
                onClick={() => onChangeRole(detail.id, detail.role)}
              >
                Toggle role
              </button>
              <button
                className="h-9 px-3 rounded-md border"
                onClick={() =>
                  resendVerify(detail.id).then((ok) =>
                    alert(ok ? "Verification email sent." : "Failed")
                  )
                }
              >
                Resend verify
              </button>
              <button
                className="h-9 px-3 rounded-md border hover:bg-red-500/10"
                onClick={() => onDelete(detail.id)}
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
