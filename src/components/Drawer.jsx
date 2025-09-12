// src/components/Drawer.jsx
import { useEffect } from "react";

export default function Drawer({
  open,
  onClose,
  title,
  children,
  width = 440,
}) {
  // ปิดด้วยปุ่ม ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      aria-label={title || "Details"}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* panel */}
      <div
        className="absolute inset-y-0 right-0 bg-white shadow-xl border-l border-[color:var(--border)] flex flex-col"
        style={{ width }}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button
            className="h-8 px-3 rounded-md border hover:bg-[color:var(--muted)]/30"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
