// src/views/Library.jsx
// "My Library" — Production view with realistic behavior.
// - Uses real data from UserContext (user.orders). No hard-coded demo in this file.
// - Auth guard: redirect to /signin when user is not authenticated.
// - Controls: Tabs (Active/Expired/All) + Search + Type Filter + Sort.
// - CTA rules (summary):
//    * ACTIVE subscription/app -> "Continue" (filled) + "Renew" (outline).
//    * EXPIRED subscription/app -> "Continue" disabled + "Renew" becomes main CTA (filled).
//    * DIGITAL (ebook/audiobook/worksheets) -> "Download" (enabled/disabled).
// - Added: progress bar now shows % number; "View order" → "View product" (navigate to product page).

import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";

// ======================================================================
// Helpers (formatting + inference)
// ======================================================================

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d ?? "");
  }
}

function daysLeft(expire) {
  if (!expire) return null;
  const endOfDay = new Date(expire);
  endOfDay.setHours(23, 59, 59, 999);
  const ms = endOfDay.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function inferType(item) {
  if (item?.type) return item.type;
  if (item?.downloadable) return "digital";
  if (typeof item?.progress === "number") return "subscription";
  return "content";
}

function isDigital(t) {
  return ["digital", "ebook", "audiobook", "worksheets"].includes(
    String(t || "").toLowerCase()
  );
}

function isDownloadDisabled(item) {
  return (
    !item?.downloadable ||
    !item?.downloadUrl ||
    item.downloadUrl === "#" ||
    item.downloadUrl === null
  );
}

// clamp 0..100
const clampPct = (n) => Math.max(0, Math.min(100, Number(n ?? 0)));

// ======================================================================
// Component
// ======================================================================
export function Library() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateOrderItem } = useUser();

  // --------------------------------------------------------------------
  // Auth guard (production): redirect to /signin if not authenticated
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // --------------------------------------------------------------------
  // Controls state
  // --------------------------------------------------------------------
  const [tab, setTab] = useState("all"); // 'active' | 'expired' | 'all'
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'digital' | 'subscription' | ...
  const [sortKey, setSortKey] = useState("title"); // 'expire' | 'purchase' | 'title'

  // --------------------------------------------------------------------
  // Build rows from user.orders
  // --------------------------------------------------------------------
  const rows = useMemo(() => {
    const list = [];
    for (const o of user?.orders || []) {
      for (const it of o.items || []) {
        list.push({
          id: `${o.id}:${it.id}`,
          orderId: o.id,
          productId: it.productId,
          title: it.name,
          type: inferType(it),
          purchaseDate: o.date,
          expireDate: it.expireDate ?? null,
          progress: typeof it.progress === "number" ? it.progress : null,
          accessUrl: it.accessUrl || null,
          downloadUrl: it.downloadUrl || null,
          downloadable: !!it.downloadable,
        });
      }
    }
    return list;
  }, [user]);

  // --------------------------------------------------------------------
  // Filter & sort pipeline
  // --------------------------------------------------------------------
  const today = new Date();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = rows.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false;
      if (typeFilter !== "all" && inferType(r) !== typeFilter) return false;

      const exp = r.expireDate ? new Date(r.expireDate) : null;
      const isActive = !exp || exp >= today;

      if (tab === "active" && !isActive) return false;
      if (tab === "expired" && isActive) return false;

      return true;
    });

    list.sort((a, b) => {
      if (sortKey === "purchase")
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      if (sortKey === "title") return a.title.localeCompare(b.title);

      // default: expire (no-expiry => bottom)
      const ax = a.expireDate ? new Date(a.expireDate).getTime() : Infinity;
      const bx = b.expireDate ? new Date(b.expireDate).getTime() : Infinity;
      return ax - bx;
    });

    return list;
  }, [rows, query, typeFilter, tab, sortKey, today]);

  // ======================================================================
  // Action handlers (wire to your backend as needed)
  // ======================================================================

  async function handleAccessLink(r) {
    try {
      const itemId = r.id; // "orderId:itemId"
      const res = await fetch(
        `/users/me/library/${encodeURIComponent(itemId)}/access-link`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Access unavailable.");
      const data = await res.json(); // { accessUrl }
      const url = data?.accessUrl || r.accessUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else toast.message("Access link not available yet.");
    } catch (e) {
      toast.message(e.message || "Cannot open this content.");
    }
  }

  async function handleDownload(r) {
    try {
      if (isDownloadDisabled(r)) {
        toast.message("Download not available yet.");
        return;
      }
      const itemId = r.id;
      const res = await fetch(
        `/users/me/library/${encodeURIComponent(itemId)}/download-link`,
        { method: "POST" }
      );
      if (res.status === 403) {
        toast.message("Download not available yet.");
        return;
      }
      if (!res.ok) throw new Error("Cannot create download link.");
      const data = await res.json(); // { downloadUrl, expiresIn }
      const url = data?.downloadUrl || r.downloadUrl;
      if (url) {
        updateOrderItem(r.orderId, r.id.split(":")[1], { downloadUrl: url });
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        toast.message("Download link not ready.");
      }
    } catch (e) {
      toast.message(e.message || "Download failed.");
    }
  }

  async function handleRenew(r, plan = "month") {
    try {
      const itemId = r.id;
      const res = await fetch(
        `/users/me/library/${encodeURIComponent(itemId)}/renew`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        }
      );
      if (res.status === 402) {
        toast.message("Payment required or failed.");
        return;
      }
      if (!res.ok) throw new Error("Renew failed.");
      const data = await res.json(); // { status, expireDate }
      if (data?.expireDate) {
        updateOrderItem(r.orderId, r.id.split(":")[1], {
          expireDate: data.expireDate,
        });
        toast.message("Renewed successfully.");
      } else {
        toast.message("Renew completed, but no new expiry returned.");
      }
    } catch (e) {
      toast.message(e.message || "Cannot renew this item.");
    }
  }

  // New: view product instead of order detail
  function handleViewProduct(r) {
    if (r?.productId) {
      navigate(`/products/${r.productId}`);
    } else {
      toast.message("Product details unavailable.");
    }
  }

  // ======================================================================
  // UI
  // ======================================================================
  return (
    <section className="p-6 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">My Library</h1>
        <div className="text-sm text-[color:var(--muted-foreground)]">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
        {/* Tabs */}
        <div className="inline-flex rounded-md border border-[color:var(--border)] overflow-hidden">
          {["active", "expired", "all"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-sm cursor-pointer ${
                tab === t
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                  : "bg-white hover:bg-[color:var(--muted)]/40"
              }`}
              aria-pressed={tab === t}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in your library…"
          className="flex-1 h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
          aria-label="Search library items"
        />

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-[color:var(--input)] bg-white cursor-pointer hover:bg-[color:var(--muted)]/40"
          title="Filter by type"
        >
          <option value="all">All types</option>
          <option value="digital">Digital</option>
          <option value="subscription">Subscription</option>
          <option value="course">Course</option>
          <option value="application">Application</option>
          <option value="ebook">Ebook</option>
          <option value="audiobook">Audiobook</option>
          <option value="worksheets">Worksheets</option>
          <option value="content">Content</option>
        </select>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="h-10 px-3 rounded-md border border-[color:var(--input)] bg-white cursor-pointer hover:bg-[color:var(--muted)]/40"
          title="Sort by"
        >
          <option value="expire">Sort by Expiry</option>
          <option value="purchase">Sort by Purchased</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="mt-8 text-gray-500">
          You have no{" "}
          {tab === "active" ? "active " : tab === "expired" ? "expired " : ""}
          items.
          <div className="mt-3">
            <Link
              to="/products"
              className="underline cursor-pointer hover:opacity-80"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filtered.map((r) => {
            const dLeft = daysLeft(r.expireDate);
            const isDanger =
              typeof dLeft === "number" && dLeft <= 7 && dLeft >= 0;
            const isExpired = typeof dLeft === "number" && dLeft < 0;

            return (
              <article
                key={r.id}
                className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6"
              >
                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold">{r.title}</h3>

                {/* Meta */}
                <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                  <div>Purchased: {fmtDate(r.purchaseDate)}</div>
                  <div className="mt-0.5">
                    {r.expireDate ? (
                      <>
                        Expires:{" "}
                        <b className="text-[color:var(--foreground)]">
                          {fmtDate(r.expireDate)}
                        </b>{" "}
                        {isExpired ? (
                          <span className="ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs bg-[color:var(--muted)]/40">
                            Expired
                          </span>
                        ) : typeof dLeft === "number" ? (
                          <span
                            className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs ${
                              isDanger
                                ? "bg-[color:var(--destructive)]/20"
                                : "bg-[color:var(--muted)]/40"
                            }`}
                          >
                            In {dLeft} day{dLeft !== 1 ? "s" : ""}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <>No expiry</>
                    )}
                  </div>
                </div>

                {/* Progress bar (with % number) */}
                {typeof r.progress === "number" && (
                  <div
                    className="mt-3 w-full relative h-3 rounded-full bg-gray-200"
                    role="progressbar"
                    aria-valuenow={clampPct(r.progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    title={`${clampPct(r.progress)}%`}
                  >
                    <div
                      className="absolute left-0 top-0 h-3 rounded-full bg-[color:var(--primary)]"
                      style={{ width: `${clampPct(r.progress)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-medium text-white select-none">
                      {clampPct(r.progress)}%
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Continue / Download */}
                  {isDigital(r.type) ? (
                    <button
                      onClick={() => handleDownload(r)}
                      disabled={isDownloadDisabled(r)}
                      className={`px-4 h-10 inline-flex items-center justify-center rounded-md border ${
                        !isDownloadDisabled(r)
                          ? "hover:bg-[color:var(--muted)]/40"
                          : "bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] cursor-not-allowed"
                      }`}
                    >
                      Download
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccessLink(r)}
                      disabled={isExpired}
                      className={`px-4 h-10 inline-flex items-center justify-center rounded-md ${
                        !isExpired
                          ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90"
                          : "bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>
                  )}

                  {/* Renew */}
                  <button
                    onClick={() => handleRenew(r)}
                    className={`px-4 h-10 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40 ${
                      isExpired
                        ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border-[color:var(--primary)] hover:opacity-90"
                        : ""
                    }`}
                    title="Renew subscription"
                  >
                    Renew
                  </button>

                  {/* View product (no order detail link) */}
                  <button
                    onClick={() => handleViewProduct(r)}
                    className="flex-1 md:flex-none px-4 h-10 inline-flex items-center justify-center rounded-md border cursor-pointer hover:bg-[color:var(--muted)]/40"
                  >
                    View product
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Library;
