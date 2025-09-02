// src/views/OrderDetail.jsx
// Professional order detail page (frontend-only mock)
// - Download buttons: disable + tooltip for placeholder links ('#')
// - Quantity: supports both `quantity` and legacy `qty`
// - Billing address: read from the order snapshot (not from profile)
// - Clean structure with clear sections & English comments

// ======================================================
// SECTION: Imports
// ======================================================
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";

// ======================================================
// SECTION: Local helpers
// ======================================================
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function money(n) {
  const v = Number(n ?? 0);
  return `$${v.toFixed(2)}`;
}

function fmtDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d ?? "");
  }
}

// Render a compact, human-readable billing address from snapshot fields
function renderBillingAddress(addr) {
  if (!addr || typeof addr !== "object") return "—";
  const parts = [
    addr.line1,
    addr.line2,
    [addr.city, addr.state].filter(Boolean).join(", "),
    addr.postalCode,
    addr.country,
  ]
    .filter(Boolean)
    .join(" • ");
  return parts || "—";
}

// Helpers for download availability
const isDownloadDisabled = (it) =>
  !it?.downloadable || !it?.downloadUrl || it.downloadUrl === "#";

// ======================================================
// SECTION: Component
// ======================================================
export function OrderDetail() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { orderId } = useParams();

  // ----------------------------------------------------
  // Find order by id from user snapshot
  // ----------------------------------------------------
  const order = useMemo(() => {
    const list = Array.isArray(user?.orders) ? user.orders : [];
    return list.find((o) => String(o.id) === String(orderId));
  }, [user, orderId]);

  // ----------------------------------------------------
  // Early return if order not found
  // ----------------------------------------------------
  if (!order) {
    return (
      <section className="layout mx-auto px-4 pt-8 pb-14">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
          We couldn't find order <b>#{orderId}</b>.
        </p>
        <div className="mt-4">
          <Link
            to="/profile#orders"
            className="inline-flex h-10 px-4 items-center rounded-md border hover:bg-[color:var(--muted)]/40"
          >
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  function handleDownload(it) {
    if (!isDownloadDisabled(it)) {
      window.open(it.downloadUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.message("Download available after payment confirmation.");
    }
  }

  // ======================================================
  // SECTION: UI
  // ======================================================
  return (
    <section className="layout mx-auto px-4 pt-8 pb-14 md:pt-10 md:pb-18">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Order details
        </h1>
        <div className="text-sm">
          <Link to="/products" className="underline">
            Browse products
          </Link>
          <span className="mx-2">|</span>
          <Link to="/profile#orders" className="underline">
            Back to Orders
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">
            Order
          </div>
          <div className="text-lg font-semibold">#{order.id}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">
            Date
          </div>
          <div className="text-lg font-semibold">{fmtDate(order.date)}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">
            Status / Total
          </div>
          <div className="text-lg font-semibold">
            {String(order.status || "").toLowerCase()} · {money(order.total)}
          </div>
        </div>
      </div>

      {/* Items */}
      <section className="mt-6 rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold">Items</h2>

        {/* Desktop table */}
        <div className="mt-4 hidden md:block overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-[color:var(--border)]">
                <th className="py-2 pr-3">Item</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((it) => {
                const qty = it.quantity ?? it.qty ?? 1;
                const disabled = isDownloadDisabled(it);
                return (
                  <tr
                    key={it.id}
                    className="border-b border-[color:var(--border)]"
                  >
                    <td className="py-3 pr-3">{it.name}</td>
                    <td className="py-3 pr-3">{qty}</td>
                    <td className="py-3 pr-3">{money(it.price)}</td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        {/* View product only if productId provided */}
                        {it.productId && (
                          <Link
                            to={`/product/${it.productId}`}
                            className="h-9 px-3 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40"
                          >
                            View product
                          </Link>
                        )}

                        <button
                          disabled={disabled}
                          onClick={() => handleDownload(it)}
                          title={
                            disabled
                              ? "Download not available yet"
                              : "Download your product"
                          }
                          className={cn(
                            "h-9 px-3 inline-flex items-center justify-center rounded-md border",
                            !disabled
                              ? "hover:bg-[color:var(--muted)]/40"
                              : "bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] cursor-not-allowed"
                          )}
                        >
                          Download {it.name}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Total row */}
              <tr>
                <td className="py-3 pr-3 font-medium" colSpan={2}>
                  Total
                </td>
                <td className="py-3 pr-3 font-medium">{money(order.total)}</td>
                <td className="py-3" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
          {(order.items || []).map((it) => {
            const qty = it.quantity ?? it.qty ?? 1;
            const disabled = isDownloadDisabled(it);
            return (
              <div
                key={it.id}
                className="rounded-md border border-[color:var(--border)] bg-white p-3"
              >
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  Qty {qty} · {money(it.price)}
                </div>
                <div className="pt-2 flex gap-2 flex-wrap">
                  {it.productId && (
                    <Link
                      to={`/product/${it.productId}`}
                      className="h-9 px-3 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40"
                    >
                      View product
                    </Link>
                  )}
                  <button
                    disabled={disabled}
                    onClick={() => handleDownload(it)}
                    title={
                      disabled
                        ? "Download not available yet"
                        : "Download your product"
                    }
                    className={cn(
                      "h-9 px-3 rounded-md border text-sm inline-flex items-center justify-center",
                      !disabled
                        ? "bg-white hover:bg-[color:var(--muted)]/40"
                        : "bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] cursor-not-allowed"
                    )}
                  >
                    Download {it.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Billing address & actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Billing address snapshot */}
        <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
          <h2 className="text-lg font-semibold">Billing address</h2>
          <div className="mt-3 text-sm">
            {renderBillingAddress(order.billingAddress)}
          </div>
        </section>

        {/* Actions */}
        <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
          <h2 className="text-lg font-semibold">Actions</h2>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={() => navigate("/profile#orders")}
              className="h-10 px-4 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40"
            >
              Back to Orders
            </button>
            <Link
              to="/products"
              className="h-10 px-4 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
