// src/views/admin/AdminDashboard.jsx
// Admin Dashboard (Mock-first) with lightweight tooltips (EN)

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip, // alias เพื่อไม่ชนกับ InfoTip
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

// ⛳ MOCK SERVICE
// ถ้ายังไม่มี alias '@' ใน Vite ให้สลับเป็น import แบบ relative:
//   import { fetchMetricsMock } from "../../mocks/metricsMock";
import { fetchMetricsMock } from "@/mocks/metricsMock";

// ✅ เริ่มด้วย mock เพื่อความนิ่งตอนเดโม
//    TODO: ตั้งเป็น false เมื่อ Backend พร้อม
const USE_MOCK = true;

// Helper เรียก API จริง (เผื่อสลับไปใช้ BE)
async function fetchJSON(url, init) {
  const res = await fetch(url, { credentials: "include", ...init });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// ---------- Tooltip copy (EN) & component ----------
const TIPS = {
  salesToday: "Gross sales completed 'today' (Asia/Bangkok time).",
  ordersToday: "Number of orders created 'today' (all statuses).",
  mtdSales: "Month-to-date sales from the 1st of this month through today.",
  aov: "Average Order Value = today's sales ÷ today's orders.",
  newUsers7d: "Users who signed up in the last 7 days.",
  emailVerify: "Share of users who successfully verified their email.",
  revenue30d: "Revenue for the past 30 days — hover to see each day's value.",
  topProducts: "Products with the highest recent cumulative sales (demo data).",
  recentOrders: "Most recent orders (demo data for presentation).",
};

function InfoTip({ text }) {
  return (
    <span className="relative group inline-flex items-center align-middle">
      <svg
        className="w-4 h-4 ml-1 cursor-help text-[color:var(--muted-foreground)]"
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="img"
        tabIndex={0}
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
        <path
          d="M12 8.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-1.25 4a.75.75 0 0 0 0 1.5h.5v3.5a.75.75 0 0 0 1.5 0v-4.25a.75.75 0 0 0-.75-.75h-1.25Z"
          fill="currentColor"
        />
      </svg>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-pre rounded-md bg-black/80 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition"
      >
        {text}
      </span>
    </span>
  );
}
// ---------------------------------------------------

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const payload = USE_MOCK
          ? // 🔹 ใช้ Mock สำหรับพรีเซนต์/ทดสอบ
            await fetchMetricsMock({ days: 30 })
          : // 🔸 TODO: เปิดใช้ API จริงเมื่อ BE พร้อม และตั้ง USE_MOCK=false
            await fetchJSON("/admin/metrics?tz=Asia/Bangkok&days=30");
        if (on) setData(payload);
      } catch (e) {
        // กัน error หน้าไม่พังเวลาเดโม
        console.error(e);
        const fallback = await fetchMetricsMock({ days: 30 });
        if (on) setData(fallback);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="h-24 rounded-md bg-[color:var(--muted)]/30 animate-pulse" />
        <div className="h-64 rounded-md bg-[color:var(--muted)]/20 animate-pulse" />
        <div className="h-64 rounded-md bg-[color:var(--muted)]/20 animate-pulse" />
      </div>
    );
  }

  const { kpi, revenueDaily, topProducts, recentOrders } = data || {};
  const currency = (n) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(n);

  const KPI = ({ label, value, sub, tooltip }) => (
    <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="text-sm text-[color:var(--muted-foreground)] flex items-center">
        {label}
        {tooltip ? <InfoTip text={tooltip} /> : null}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && (
        <div className="text-xs text-[color:var(--muted-foreground)] mt-1">
          {sub}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPI
          label="Sales (Today)"
          value={currency(kpi.todaySales)}
          tooltip={TIPS.salesToday}
        />
        <KPI
          label="Orders (Today)"
          value={kpi.todayOrders}
          tooltip={TIPS.ordersToday}
        />
        <KPI
          label="Sales (MTD)"
          value={currency(kpi.mtdSales)}
          tooltip={TIPS.mtdSales}
        />
        <KPI label="AOV" value={currency(kpi.aov)} tooltip={TIPS.aov} />
        <KPI
          label="New Users (7d)"
          value={kpi.newUsers7d}
          tooltip={TIPS.newUsers7d}
        />
        <KPI
          label="Email Verify Rate"
          value={`${Math.round(kpi.emailVerifyRate * 100)}%`}
          tooltip={TIPS.emailVerify}
        />
      </section>

      {/* Revenue Trend (Last 30 days) */}
      <section className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] p-4">
        <div className="font-semibold mb-2 flex items-center">
          Revenue (Last 30 days)
          <InfoTip text={TIPS.revenue30d} />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueDaily}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--chart-1)"
                fill="url(#revGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top Products + Recent Orders */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] p-4">
          <div className="font-semibold mb-2 flex items-center">
            Top Products
            <InfoTip text={TIPS.topProducts} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)] p-4">
          <div className="font-semibold mb-2 flex items-center">
            Recent Orders
            <InfoTip text={TIPS.recentOrders} />
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[color:var(--muted-foreground)]">
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">User</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr
                    key={o.orderNo}
                    className="border-t border-[color:var(--border)]"
                  >
                    <td className="py-2 pr-3">{o.orderNo}</td>
                    <td className="py-2 pr-3">{o.user}</td>
                    <td className="py-2 pr-3">{currency(o.total)}</td>
                    <td className="py-2 pr-3">{o.status}</td>
                    <td className="py-2">
                      {new Date(o.createdAt).toLocaleString("th-TH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TODO:
        - เมื่อ Backend พร้อม ให้ตั้ง USE_MOCK = false
        - ตรวจสอบให้ /admin/metrics คืนรูปแบบ JSON ตามที่คอมโพเนนต์นี้ใช้งาน:
          {
            kpi: { todaySales, todayOrders, mtdSales, aov, newUsers7d, emailVerifyRate },
            revenueDaily: [{ date: "YYYY-MM-DD", amount: number }],
            topProducts: [{ name: string, sales: number }],
            recentOrders: [{ orderNo, user, total, status, createdAt }]
          }
        - ถ้าชื่อฟิลด์ BE ไม่ตรง ให้ map/adapter ใน fetchJSON หลังจาก res.json()
      */}
    </div>
  );
}
