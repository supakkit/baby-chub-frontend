// src/mocks/metricsMock.js
// Mock data สำหรับหน้า AdminDashboard

function genRevenue(days = 30) {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      amount: Math.round((Math.sin(i / 4) + 1.2) * 3000 + Math.random() * 800),
    };
  });
}

function genTopProducts() {
  return [
    { name: "KidVerse – App", sales: 128900 },
    { name: "Python Adventure – Course", sales: 102300 },
    { name: "Shapes – Ebook", sales: 74300 },
    { name: "SafeNet Junior – App", sales: 59800 },
    { name: "Scratch – Course", sales: 51200 },
  ];
}

function genRecentOrders(n = 10) {
  return Array.from({ length: n }, (_, i) => ({
    orderNo: `RT-202509${String(10 - i).padStart(2, "0")}000${i}`,
    user: i % 2 ? "Demo User" : "Jane D.",
    total: 99 + i * 10,
    status: i % 3 === 0 ? "pending" : "paid",
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  }));
}

// ฟังก์ชันหลักให้หน้า Dashboard เรียกใช้
export async function fetchMetricsMock({ days = 30 } = {}) {
  // ทำเป็น async ให้ interface เหมือนเรียก API จริง
  return {
    kpi: {
      todaySales: 12490.25,
      todayOrders: 37,
      mtdSales: 532140.5,
      aov: 420.33,
      newUsers7d: 186,
      emailVerifyRate: 0.87,
    },
    revenueDaily: genRevenue(days),
    topProducts: genTopProducts(),
    recentOrders: genRecentOrders(10),
  };
}
