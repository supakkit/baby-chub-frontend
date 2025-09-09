// src/context/UserContext.jsx
// User state (mock) with localStorage persistence
// - Starts UNAUTHENTICATED (no user) until login()
// - Backward-compatible API: login, logout, updateProfile, updatePreferences,
//   toggleNewsletter, changePassword, deleteAccount
// - Demo mode: call login() with no args to use DEFAULT_USER
// - Exposes: isAuthenticated, ordersCount, addOrder, updateOrderItem

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const STORAGE_KEY = "babychub:user";

const DEFAULT_USER = {
  id: "u_demo",
  firstName: "Demo",
  lastName: "User",
  email: "demo@babychub.app",
  phone: "",
  avatarUrl: "",
  address: {
    line1: "",
    line2: "",
    city: "Bangkok",
    state: "TH",
    postalCode: "10200",
    country: "Thailand",
  },
  preferences: { ageRange: "4-6", interests: ["STEM", "Art"] },
  notifications: { orderUpdates: true, productTips: true, promotions: true },
  newsletter: true,
  // --- Orders: 4 cases for realistic Library ---
  orders: [
    // 1) Subscription (active) — Continue + Renew
    {
      id: "ord-9001",
      date: new Date().toISOString(),
      status: "paid",
      total: 99,
      items: [
        {
          id: "i-1",
          productId: "course-python-adventure",
          name: "Code Explorers: Python Adventure (Course)",
          downloadable: false,
          accessUrl: "/learn/python-demo",
          expireDate: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(),
          progress: 42,
        },
      ],
    },
    // 2) Digital (ready) — Download enabled
    {
      id: "ord-9002",
      date: new Date().toISOString(),
      status: "paid",
      total: 89,
      items: [
        {
          id: "i-2",
          productId: "ebook-adventures-of-square",
          name: "Wonders of Shapes (Ebook • PDF)",
          downloadable: true,
          // UI จะขอ signed URL ผ่าน API ก่อนดาวน์โหลดจริง
          downloadUrl: null,
        },
      ],
    },
    // 3) Digital (not ready) — Download disabled (API ควรตอบ 403)
    {
      id: "ord-9003",
      date: new Date().toISOString(),
      status: "paid",
      total: 199,
      items: [
        {
          id: "i-3",
          productId: "audiobook-little-kitty-bedtime",
          name: "Little Kitty’s Bedtime (Audiobook • MP3)",
          downloadable: true,
          downloadUrl: "#", // ถือว่ายังไม่พร้อม → UI แสดง disabled + toast
        },
      ],
    },
    // 4) Subscription (expired) — Expired tab only
    {
      id: "ord-9004",
      date: new Date().toISOString(),
      status: "paid",
      total: 149,
      items: [
        {
          id: "i-4",
          productId: "app-kidverse",
          name: "KidVerse – Learning World (App)",
          downloadable: false,
          accessUrl: "/learn/kidverse-demo",
          expireDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          progress: 80,
        },
      ],
    },
  ],
  sessions: [
    {
      id: "sess-current",
      device: "This device",
      ip: "127.0.0.1",
      lastActive: new Date().toISOString(),
    },
  ],
};

const Ctx = createContext(null);

export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}

export function UserProvider({ children }) {
  // start not logged-in
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!(user && user.id);
  const ordersCount = user?.orders?.length ?? 0;

  useEffect(() => {
    try {
      if (user && Object.keys(user).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  // ----- Auth -----
  const login = useCallback((payload = {}) => {
    const next = {
      ...DEFAULT_USER,
      ...payload,
      id: payload?.id || payload?.userId || DEFAULT_USER.id,
    };
    setUser(next);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser(null);
    return true;
  }, []);

  // ----- Profile/Prefs -----
  const updateProfile = useCallback((partial) => {
    setUser((u) => ({ ...(u || {}), ...partial }));
    return true;
  }, []);

  const updatePreferences = useCallback((partial) => {
    setUser((u) => ({
      ...(u || {}),
      preferences: { ...(u?.preferences || {}), ...partial },
    }));
    return true;
  }, []);

  const toggleNewsletter = useCallback((on) => {
    setUser((u) => ({ ...(u || {}), newsletter: !!on }));
    return true;
  }, []);

  const changePassword = useCallback(async (current, next) => {
    if (!current || !next || next.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }
    return true;
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser(null);
    return true;
  }, []);

  // ----- Orders helpers (used by Library after API calls) -----
  const addOrder = useCallback((order) => {
    setUser((prev) => {
      if (!prev) return prev;
      const orders = [order, ...(prev.orders || [])];
      return { ...prev, orders };
    });
  }, []);

  const updateOrderItem = useCallback((orderId, itemId, patch = {}) => {
    setUser((prev) => {
      if (!prev) return prev;
      const clone = structuredClone(prev);
      const ord = clone.orders?.find((o) => o.id === orderId);
      if (!ord) return prev;
      const it = ord.items?.find((i) => i.id === itemId);
      if (!it) return prev;
      Object.assign(it, patch);
      return clone;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      ordersCount,

      login,
      logout,

      updateProfile,
      updatePreferences,
      toggleNewsletter,
      changePassword,
      deleteAccount,

      addOrder,
      updateOrderItem,
    }),
    [
      user,
      isAuthenticated,
      ordersCount,
      login,
      logout,
      updateProfile,
      updatePreferences,
      toggleNewsletter,
      changePassword,
      deleteAccount,
      addOrder,
      updateOrderItem,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
