// src/views/admin/AdminOrders.jsx
import { useEffect, useMemo, useState } from "react";
import Drawer from "../../components/Drawer";


const MOCK = true; // ← BE พร้อมแล้วค่อยเปลี่ยนเป็น false

function mockOrders(page = 1, limit = 20) {
  const items = Array.from({ length: limit }, (_, i) => {
    const n = (page - 1) * limit + i;
    return {
      id: `o_${n}`,
      orderNo: `RT-202509${String(15 - (n % 10)).padStart(2, "0")}00${n}`,
      user: n % 2 ? "Demo User" : "Jane D.",
      items: 1 + (n % 4),
      subtotal: 99 + n * 5,
      discount: n % 3 ? 0 : 20,
      total: 99 + n * 5 - (n % 3 ? 0 : 20),
      status: ["pending", "paid", "cancelled"][n % 3],
      method: n % 2 ? "card" : "bank",
      createdAt: new Date(Date.now() - n * 7200_000).toISOString(),
    };
  });
  return { items, total: 300, page, pageSize: limit };
}
function mockOrderDetail(id) {
  return {
    id,
    orderNo: "RT-202509100001",
    user: { name: "Jane D.", email: "jane@example.com" },
    items: [
      { name: "KidVerse – App", qty: 1, price: 499 },
      { name: "Shapes – Ebook", qty: 1, price: 199 },
    ],
    subtotal: 698,
    discount: 50,
    total: 648,
    status: "pending",
    method: "card",
    paymentRef: "CH_123456",
    createdAt: "2025-09-10T10:22:00Z",
    timeline: [
      { at: "2025-09-10T10:22:00Z", text: "Order created" },
      { at: "2025-09-10T10:25:10Z", text: "Awaiting payment" },
    ],
    note: "Customer asked for invoice.",
  };
}

async function getOrders(params) {
  const { page = 1, limit = 20 } = params || {};
  if (MOCK) return mockOrders(Number(page), Number(limit));
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/admin/orders?${qs}`, { credentials: "include" });
  if (!res.ok) throw new Error("Fetch /admin/orders failed");
  return res.json();
}
async function getOrderDetail(id) {
  if (MOCK) return mockOrderDetail(id);
  const res = await fetch(`/admin/orders/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Fetch /admin/orders/:id failed");
  return res.json();
}
async function patchOrderStatus(id, status) {
  if (MOCK) return new Promise((r) => setTimeout(() => r(true), 250));
  const res = await fetch(`/admin/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  return res.ok;
}
async function deleteOrder(id) {
  if (MOCK) return new Promise((r) => setTimeout(() => r(true), 250));
  const res = await fetch(`/admin/orders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

export default function AdminOrders() {
  const [status, setStatus] = useState("");
  const [range, setRange] = useState("30d");
  const [user, setUser] = useState("");
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
    getOrders({ status, user, page, limit })
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [status, range, user, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data.total || 0) / limit)),
    [data.total]
  );
  const currency = (n) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(n);

  const onChangeStatus = async (id, next) => {
    const ok = await patchOrderStatus(id, next);
    if (ok) {
      setData((d) => ({
        ...d,
        items: d.items.map((o) => (o.id === id ? { ...o, status: next } : o)),
      }));
      if (detail?.id === id) setDetail((s) => ({ ...s, status: next }));
    } else alert("Failed to update status");
  };
  const onDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    const ok = await deleteOrder(id);
    if (ok) {
      setData((d) => ({
        ...d,
        items: d.items.filter((o) => o.id !== id),
        total: (d.total || 1) - 1,
      }));
      if (detail?.id === id) setOpen(false);
    } else alert("Failed to delete order");
  };

  const onView = async (id) => {
    setSelectedId(id);
    setOpen(true);
    setLoadingDetail(true);
    try {
      const d = await getOrderDetail(id);
      setDetail(d);
    } finally {
      setLoadingDetail(false);
    }
  };

  const RowActions = (o) => (
    <div className="flex flex-wrap gap-2">
      <button
        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
        onClick={() => onView(o.id)}
      >
        View
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
        onClick={() => onChangeStatus(o.id, "paid")}
      >
        Mark paid
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
        onClick={() => onChangeStatus(o.id, "cancelled")}
      >
        Cancel
      </button>
      <button
        className="h-9 px-3 rounded-md border hover:bg-red-500/10"
        onClick={() => onDelete(o.id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="h-10 px-3 rounded-md border"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="h-10 px-3 rounded-md border"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <input
          className="h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
          placeholder="By user/email"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[color:var(--muted-foreground)]">
              <th className="py-2 px-3">Order</th>
              <th className="py-2 px-3">User</th>
              <th className="py-2 px-3">Items</th>
              <th className="py-2 px-3">Subtotal</th>
              <th className="py-2 px-3">Discount</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Created</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-center">
                  No orders
                </td>
              </tr>
            ) : (
              data.items.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-[color:var(--border)]"
                >
                  <td className="py-2 px-3">{o.orderNo}</td>
                  <td className="py-2 px-3">{o.user}</td>
                  <td className="py-2 px-3">{o.items}</td>
                  <td className="py-2 px-3">{currency(o.subtotal)}</td>
                  <td className="py-2 px-3">{currency(o.discount)}</td>
                  <td className="py-2 px-3">{currency(o.total)}</td>
                  <td className="py-2 px-3">{o.status}</td>
                  <td className="py-2 px-3">{o.method}</td>
                  <td className="py-2 px-3">
                    {new Date(o.createdAt).toLocaleString("th-TH")}
                  </td>
                  <td className="py-2 px-3">
                    <RowActions {...o} />
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

      {/* Drawer: Order detail */}
      <Drawer open={open} onClose={() => setOpen(false)} title="Order details">
        {loadingDetail || !detail ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-[color:var(--muted)]/40 rounded" />
            <div className="h-4 bg-[color:var(--muted)]/30 rounded w-2/3" />
            <div className="h-28 bg-[color:var(--muted)]/20 rounded" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Order:</span> {detail.orderNo}
            </div>
            <div>
              <span className="font-medium">User:</span> {detail.user?.name} (
              {detail.user?.email})
            </div>
            <div>
              <span className="font-medium">Status:</span> {detail.status}
            </div>
            <div>
              <span className="font-medium">Payment:</span> {detail.method}{" "}
              {detail.paymentRef ? `• ${detail.paymentRef}` : ""}
            </div>
            <div>
              <span className="font-medium">Items:</span>
              <ul className="list-disc pl-5">
                {detail.items.map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.qty} — {currency(it.price)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium">Subtotal:</span>{" "}
              {currency(detail.subtotal)}
            </div>
            <div>
              <span className="font-medium">Discount:</span>{" "}
              {currency(detail.discount)}
            </div>
            <div>
              <span className="font-medium">Total:</span>{" "}
              {currency(detail.total)}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(detail.createdAt).toLocaleString("th-TH")}
            </div>
            {detail.timeline?.length > 0 && (
              <div>
                <span className="font-medium">Timeline:</span>
                <ul className="list-disc pl-5">
                  {detail.timeline.map((t, i) => (
                    <li key={i}>
                      {new Date(t.at).toLocaleString("th-TH")} — {t.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detail.note && (
              <div>
                <span className="font-medium">Note:</span> {detail.note}
              </div>
            )}

            <div className="pt-3 flex gap-2">
              <button
                className="h-9 px-3 rounded-md border"
                onClick={() => onChangeStatus(detail.id, "paid")}
              >
                Mark paid
              </button>
              <button
                className="h-9 px-3 rounded-md border"
                onClick={() => onChangeStatus(detail.id, "cancelled")}
              >
                Cancel
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
