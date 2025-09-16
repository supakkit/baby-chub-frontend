// src/views/LibraryReader.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000/api/v1

export default function LibraryReader() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);      // รายการ “ของในคลัง”
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ดึงข้อมูลรายการจาก backend ด้วย axios
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        // ถ้ามี endpoint library จริง เช่น /users/me/library ให้เปลี่ยนเป็นอันนั้นได้เลย
        const res = await axios.get(`${API_URL}/products`, {
          params: { limit: 30 },
          withCredentials: true,
          signal: controller.signal,
        });

        const list = Array.isArray(res?.data?.products) ? res.data.products : [];

        const normalized = list.map((p) => ({
          id: p._id || p.id,
          name: p.name || p.title || "Untitled",
          image:
            (Array.isArray(p.images) && p.images[0]) ||
            p.image ||
            p.thumbnail ||
            "/images/placeholder.png",
          description: p.description || "",
        }));

        setItems(normalized);

        // ถ้ายังไม่มี productId ใน URL ให้พาไปตัวแรก
        if (!productId && normalized.length) {
          navigate(`/library/reader/${normalized[0].id}`, { replace: true });
        }
      } catch (e) {
        // ถ้ายกเลิกเองไม่ต้องโชว์ error
        if (axios.isCancel(e)) return;
        setError(e?.message || "Failed to load library");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [productId, navigate]);

  // หาตัวที่เลือก
  const current = useMemo(
    () => items.find((it) => String(it.id) === String(productId)),
    [items, productId]
  );

  return (
    <section className="w-full">
      {/* Header บนของหน้า */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Your Library</h1>
        <p className="text-sm text-muted-foreground">
          Pick a product on the left to preview its content.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-6">
          {/* Sidebar: รายการในคลัง */}
          <aside
            className="
              bg-white border rounded-md
              overflow-hidden
              h-[60vh] md:h-[72vh]
              flex flex-col
            "
          >
            <div className="px-3 py-2 border-b bg-muted/40">
              <p className="text-sm font-medium">My Products</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-3 space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-3 text-sm text-red-600">{error}</div>
              ) : items.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  No items in library.
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((it) => {
                    const active = String(it.id) === String(productId);
                    return (
                      <li key={it.id}>
                        <Link
                          to={`/library/reader/${it.id}`}
                          className={[
                            "flex gap-3 items-center p-3 hover:bg-muted/60 transition",
                            active ? "bg-muted/60" : "",
                          ].join(" ")}
                        >
                          <div className="h-10 w-10 flex-shrink-0 bg-muted overflow-hidden">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="h-full w-full object-cover"
                              draggable={false}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{it.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {it.description || "Ready to use"}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          {/* Viewer: ส่วนแสดงผลหลัก */}
          <main
            className="
              bg-white border rounded-md
              h-[60vh] md:h-[72vh]
              p-3 md:p-4
              flex flex-col
            "
          >
            {/* Toolbar บางๆ */}
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Preview</span>
                {current ? (
                  <span className="text-sm font-medium">— {current.name}</span>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {/* ปุ่ม UI-only */}
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border hover:bg-muted"
                  title="Zoom In (UI only)"
                >
                  + Zoom
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border hover:bg-muted"
                  title="Zoom Out (UI only)"
                >
                  − Zoom
                </button>
                <a
                  href={current?.image || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-2 py-1 rounded border hover:bg-muted"
                  title="Open image in new tab"
                >
                  Open
                </a>
              </div>
            </div>

            {/* Canvas แสดงภาพ */}
            <div className="flex-1 overflow-auto grid place-items-center bg-muted/20">
              {loading ? (
                <div className="h-48 w-48 bg-muted animate-pulse rounded" />
              ) : current ? (
                <img
                  src={current.image}
                  alt={current.name}
                  className="max-h-[90%] max-w-[95%] object-contain select-none"
                  draggable={false}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Select a product</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
