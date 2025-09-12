// src/context/UserContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

// Services (ต้องมีไฟล์ src/services/userServices.js ตามที่จัดให้ก่อนหน้า)
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
} from "../services/userServices";

const Ctx = createContext(null);

// เก็บ preferences ฝั่ง FE (เพราะ BE ยังไม่มี schema/route นี้)
const PREFS_KEY = "babychub:prefs";
// โหมด demo เผื่อหน้าเก่าเรียก login แบบ mock (ไม่มี password)
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
  // เราจะเก็บ user จาก BE + merge preferences ฝั่ง FE
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const isAuthenticated = !!user?.id;
  const ordersCount = user?.orders?.length ?? 0;

  // ---------- Boot: โหลด session จาก cookie ----------
  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUser(); // GET /auth/me (อ่าน cookie)
        // (option) preload orders จาก BE เพื่อลด N+1 ภายหลัง
        let orders = [];
        try {
          const got = await getMyOrders();
          orders = Array.isArray(got) ? got : [];
        } catch {}
        // merge preferences ฝั่ง FE
        const prefs = loadPrefs();
        setUser({ ...me, preferences: prefs, orders });
      } catch {
        setUser(null); // ยังไม่ล็อกอิน
      } finally {
        setLoadingMe(false);
      }
    })();
  }, []);

  // ---------- AUTH ----------
  const login = useCallback(async (payload = {}) => {
    // ถ้ามี password → เข้าสู่ระบบจริง
    if (payload?.password) {
      const { user: u } = await signin({
        email: payload.email,
        password: payload.password,
      }); // POST /auth/login (cookie)
      // เติม preferences ฝั่ง FE + preload orders
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

    // ไม่มี password (เคส legacy/mock) → demo mode เท่านั้น
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
      await apiLogout(); // POST /auth/logout (ล้าง cookie)
    } finally {
      setUser(null);
    }
    return true;
  }, []);

  // ---------- PROFILE (รวม router อัตโนมัติ) ----------
  // ใช้ signature เดิม: updateProfile(partial)
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

    // 5) Basic fields (firstName, lastName, mobile, targetAge)
    const updated = await updateProfileBasics(partial); // PATCH /users
    setUser((u) => ({ ...(u || {}), ...updated }));
    return true;
  }, []);

  // ---------- Preferences (ฝั่ง FE เท่านั้น) ----------
  // ใช้ signature เดิม: updatePreferences(partial)
  const updatePreferencesFE = useCallback((partial) => {
    setUser((u) => {
      const next = {
        ...(u || {}),
        preferences: { ...(u?.preferences || {}), ...(partial || {}) },
      };
      // persist ฝั่ง FE
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
  // ใช้ signature เดิม: changePassword(current, next)
  const changePassword = useCallback(async (current, next) => {
    if (!current || !next) throw new Error("Missing current/new password.");
    if (next.length < 8)
      throw new Error("Password must be at least 8 characters.");
    await apiChangePassword({ currentPassword: current, newPassword: next }); // PATCH /users/password
    return true;
  }, []);

  // ---------- Delete account ----------
  const deleteAccount = useCallback(async () => {
    // ตรงกับ DELETE /users ใน backend
    const { default: api } = await import("../services/api");
    await api.delete("/users");
    setUser(null);
    return true;
  }, []);

  // ---------- Orders helpers (คงสัญญาเดิม) ----------
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

      // orders (used by Library UI)
      addOrder,
      updateOrderItem,
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
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
