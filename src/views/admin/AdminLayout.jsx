// src/views/admin/AdminLayout.jsx
import { Link, NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/orders", label: "Orders" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-[color:var(--border)] bg-[color:var(--card)] p-4">
        <Link to="/" className="block mb-6 font-extrabold text-xl">
          BabyChub Admin
        </Link>
        <nav className="space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                "block px-3 py-2 rounded-md transition " +
                (isActive
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                  : "hover:bg-[color:var(--muted)]/30")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="p-4 md:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          Admin
        </motion.h1>
        <Outlet />
      </main>
    </div>
  );
}
