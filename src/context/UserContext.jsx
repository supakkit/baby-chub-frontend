// src/context/UserContext.jsx
// User state (mock) with localStorage persistence
// - Named exports only (useUser, UserProvider) to match app-wide import style
// - Order mock aligned with UI: uses `quantity`, has `billingAddress`, downloadUrl null
// - Password policy: >= 8 characters

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "babychub:user";

// ------------------------------------------------------
// Mock user snapshot (safe to tweak for demo)
// ------------------------------------------------------
const DEFAULT_USER = {
  id: "u_1001",
  firstName: "Baby",
  lastName: "Chub",
  email: "baby@example.com",
  phone: "",
  avatarUrl: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  preferences: { ageRange: "4-6", interests: ["STEM", "Art"] },
  notifications: {
    orderUpdates: true,
    productTips: true,
    promotions: true,
  },
  newsletter: true,
  // --- Orders snapshot: quantity, billingAddress, downloadUrl null ---
  orders: [
    {
      id: "ORD-24001",
      date: "2025-05-20T07:00:00.000Z",
      total: 19.99,
      status: "paid",
      billingAddress: {
        line1: "123 Main St",
        line2: "",
        city: "Bangkok",
        state: "TH",
        postalCode: "10200",
        country: "Thailand",
      },
      items: [
        {
          id: "p1",
          name: "Phonics Starter Pack",
          price: 19.99,
          quantity: 1, // NOTE: preferred shape
          downloadable: true,
          downloadUrl: null, // placeholder -> disabled in UI
          productId: "p1", // optional: enables "View product" button
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

// ------------------------------------------------------
// Hook: useUser()
// ------------------------------------------------------
export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}

// ------------------------------------------------------
// Provider: UserProvider
// ------------------------------------------------------
export function UserProvider({ children }) {
  // Load from localStorage on first mount
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage whenever user changes
  useEffect(() => {
    try {
      if (user && Object.keys(user).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors in demo
    }
  }, [user]);

  // ---------------------- Actions ----------------------

  // Mock login: merge DEFAULT_USER with payload and ensure an id
  function login(payload = {}) {
    const next = {
      ...DEFAULT_USER,
      ...payload,
      id: payload?.id || `u_${Date.now()}`,
    };
    setUser(next);
    return true;
  }

  // Logout: clear state + storage
  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser({});
  }

  // Update top-level profile fields
  function updateProfile(partial) {
    setUser((u) => ({ ...u, ...partial }));
    return true;
  }

  // Update nested preferences
  function updatePreferences(partial) {
    setUser((u) => ({
      ...u,
      preferences: { ...u.preferences, ...partial },
    }));
    return true;
  }

  // Toggle newsletter flag
  function toggleNewsletter(on) {
    setUser((u) => ({ ...u, newsletter: !!on }));
    return true;
  }

  // Change password (mock policy: >= 8 chars)
  async function changePassword(current, next) {
    if (!current || !next || next.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }
    // In real app: verify current, call backend, etc.
    return true;
  }

  // Delete account (demo): clear storage and state
  async function deleteAccount() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser({});
    return true;
  }

  // Provide stable value to consumers
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateProfile,
      updatePreferences,
      toggleNewsletter,
      changePassword,
      deleteAccount,
    }),
    [user]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
