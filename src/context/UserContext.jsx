// src/context/UserContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  signin,
  getCurrentUser,
  logout as apiLogout,
  updateProfileBasics,
  updateAddress,
  updateNotifications,
  toggleNewsletter as apiToggleNewsletter,
  changePassword as apiChangePassword,
  updateAvatar,
  removeAvatar,
  getMyOrders,
  // --- sessions services ---
  getMySessions,
  revokeSession,
} from "../services/userServices";

const Ctx = createContext(null);

// FE-only prefs
const PREFS_KEY = "babychub:prefs";
const DEMO_MODE =
  String(import.meta.env?.VITE_DEMO_MODE || "").toLowerCase() === "true";
const DEMO_USER = {
  id: "u_demo",
  firstName: "Demo",
  lastName: "User",
  email: "demo@babychub.app",
  role: "user",
  notifications: { orderUpdates: true, productTips: true, promotions: false },
  newsletter: false,
  targetAge: { from: 6, to: 10 },
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : { ageRange: "", interests: [] };
  } catch {
    return { ageRange: "", interests: [] };
  }
}
function savePrefs(p) {
  try {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify(p || { ageRange: "", interests: [] })
    );
  } catch {}
}

export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  // --- sessions state (shared) ---
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const isAuthenticated = !!user?.id;
  const ordersCount = user?.orders?.length ?? 0;

  // ---------- Boot: load me (and optionally orders) ----------
  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUser(); // cookie-based
        // preload orders to avoid N+1 later
        let orders = [];
        try {
          const got = await getMyOrders();
          orders = Array.isArray(got) ? got : [];
        } catch {}
        const prefs = loadPrefs();
        setUser({ ...me, preferences: prefs, orders });
      } catch {
        setUser(null);
      } finally {
        setLoadingMe(false);
      }
    })();
  }, []);

  // ---------- Sessions ----------
  const loadSessions = useCallback(async () => {
    try {
      const list = await getMySessions();
      const arr = Array.isArray(list) ? list : [];
      setSessions(arr);
      // หา current session id (ถ้า BE ส่ง current: true มาด้วย)
      const cur = arr.find((x) => x.current === true);
      setCurrentSessionId(cur?._id || null);
    } catch {
      setSessions([]);
      setCurrentSessionId(null);
    }
  }, []);

  const revokeSessionById = useCallback(
    async (id) => {
      // เรียก API เพิกถอน
      const info = await revokeSession(id); // แนะนำให้ BE คืน { revoked: true, current: boolean }
      // รีเฟรชรายการเสมอ
      await loadSessions();

      // เกณฑ์ตัดสินใจ logout:
      // 1) ถ้า BE บอกว่า current === true → logout
      // 2) ถ้า BE ไม่บอก current: ใช้ตัวเทียบกับ currentSessionId เดิม
      const revokedIsCurrent =
        info?.current === true || (currentSessionId && id === currentSessionId);

      if (revokedIsCurrent) {
        await logout(); // clear FE + call /auth/logout
      }
      return true;
    },
    [loadSessions, currentSessionId]
  );

  // ---------- AUTH ----------
  const login = useCallback(async (payload = {}) => {
    if (payload?.password) {
      const { user: u } = await signin({
        email: payload.email,
        password: payload.password,
      });
      const prefs = loadPrefs();
      let orders = [];
      try {
        const got = await getMyOrders();
        orders = Array.isArray(got) ? got : [];
      } catch {}
      const next = { ...u, preferences: prefs, orders };
      setUser(next);
      return next;
    }

    if (DEMO_MODE) {
      const prefs = loadPrefs();
      const next = {
        ...DEMO_USER,
        email: payload.email || DEMO_USER.email,
        preferences: prefs,
        orders: [],
      };
      setUser(next);
      return next;
    }
    throw new Error("Please provide email and password.");
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout(); // POST /auth/logout → clear cookies server-side
    } finally {
      setUser(null);
      setSessions([]);
      setCurrentSessionId(null);
    }
    return true;
  }, []);

  // ---------- PROFILE ----------
  const updateProfile = useCallback(async (partial) => {
    if (!partial || typeof partial !== "object") return true;

    // 1) Address
    if (partial.address) {
      const updated = await updateAddress(partial.address); // PATCH /users/address
      setUser((u) => ({ ...(u || {}), ...updated }));
      return true;
    }

    // 2) Notifications
    if (partial.notifications) {
      const updated = await updateNotifications(partial.notifications); // PATCH /users/notifications
      setUser((u) => ({ ...(u || {}), ...updated }));
      return true;
    }

    // 3) Newsletter
    if (Object.prototype.hasOwnProperty.call(partial, "newsletter")) {
      const updated = await apiToggleNewsletter(!!partial.newsletter); // PATCH /users/newsletter
      setUser((u) => ({ ...(u || {}), ...updated }));
      return true;
    }

    // 4) Avatar
    if (Object.prototype.hasOwnProperty.call(partial, "avatarUrl")) {
      const updated =
        partial.avatarUrl && partial.avatarUrl.length > 0
          ? await updateAvatar(partial.avatarUrl) // PATCH /users/avatar
          : await removeAvatar(); // DELETE /users/avatar
      setUser((u) => ({ ...(u || {}), ...updated }));
      return true;
    }

    // 5) Basic fields
    const updated = await updateProfileBasics(partial); // PATCH /users
    setUser((u) => ({ ...(u || {}), ...updated }));
    return true;
  }, []);

  // ---------- Preferences (FE-only) ----------
  const updatePreferencesFE = useCallback((partial) => {
    setUser((u) => {
      const next = {
        ...(u || {}),
        preferences: { ...(u?.preferences || {}), ...(partial || {}) },
      };
      savePrefs(next.preferences);
      return next;
    });
    return true;
  }, []);

  // ---------- Newsletter toggle ----------
  const toggleNewsletter = useCallback(async (on) => {
    const updated = await apiToggleNewsletter(!!on);
    setUser((u) => ({ ...(u || {}), ...updated }));
    return true;
  }, []);

  // ---------- Password ----------
  const changePassword = useCallback(async (current, next) => {
    if (!current || !next) throw new Error("Missing current/new password.");
    if (next.length < 8)
      throw new Error("Password must be at least 8 characters.");
    await apiChangePassword({ currentPassword: current, newPassword: next }); // PATCH /users/password
    return true;
  }, []);

  // ---------- Delete account ----------
  const deleteAccount = useCallback(async () => {
    const { default: api } = await import("../services/api");
    await api.delete("/users");
    setUser(null);
    setSessions([]);
    setCurrentSessionId(null);
    return true;
  }, []);

  // ---------- Orders helpers ----------
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
      const ord = clone.orders?.find(
        (o) => String(o._id || o.id) === String(orderId)
      );
      if (!ord) return prev;
      const it = ord.items?.find(
        (i) => String(i._id || i.id) === String(itemId)
      );
      if (!it) return prev;
      Object.assign(it, patch);
      return clone;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loadingMe,
      ordersCount,

      // auth
      login,
      logout,

      // profile & prefs
      updateProfile,
      updatePreferences: updatePreferencesFE,
      toggleNewsletter,
      changePassword,
      deleteAccount,

      // orders
      addOrder,
      updateOrderItem,

      // sessions (shared)
      sessions,
      loadSessions,
      revokeSession: revokeSessionById,
      currentSessionId,
    }),
    [
      user,
      isAuthenticated,
      loadingMe,
      ordersCount,
      login,
      logout,
      updateProfile,
      updatePreferencesFE,
      toggleNewsletter,
      changePassword,
      deleteAccount,
      addOrder,
      updateOrderItem,
      sessions,
      loadSessions,
      revokeSessionById,
      currentSessionId,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
