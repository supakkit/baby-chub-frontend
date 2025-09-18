// src/services/userServices.js
// NOTE(TH): ใช้ Axios instance จาก api.js สำหรับทุก endpoint ปกติ
//           ยกเว้น "Orders" ที่เราบังคับให้ใช้ mock เพื่อเดโมหน้า Library
import api from "./api";

/* =======================================================================
 * 1) Auth: Sign Up / Sign In / Forgot / Reset
 * ======================================================================= */
export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data; // { user, message }
}

export async function resendVerification(email) {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data; // { message }
}

export async function signin({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { user, message }
}

export async function forgotPassword(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data; // { message }
}

export async function resetPassword({ token, newPassword }) {
  const { data } = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return data; // { message }
}

/* =======================================================================
 * 2) Me / Profile
 * ======================================================================= */
export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user; // sanitized user
}

export async function getProfile() {
  const { data } = await api.get("/users");
  return data.user;
}

export async function updateProfileBasics(payload) {
  const { data } = await api.patch("/users", payload);
  return data.user;
}

export async function updateAddress(addressPayload) {
  const { data } = await api.patch("/users/address", addressPayload);
  return data.user;
}

export async function updateNotifications(prefs) {
  const { data } = await api.patch("/users/notifications", prefs);
  return data.user;
}

export async function toggleNewsletter(newsletter) {
  const { data } = await api.patch("/users/newsletter", {
    newsletter: !!newsletter,
  });
  return data.user;
}

export async function updateAvatar(avatarUrl) {
  const { data } = await api.patch("/users/avatar", { avatarUrl });
  return data.user;
}

export async function removeAvatar() {
  const { data } = await api.delete("/users/avatar");
  return data.user;
}

export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await api.patch("/users/password", {
    currentPassword,
    newPassword,
  });
  return data; // { message }
}

/* =======================================================================
 * 3) Orders (LIBRARY-ONLY MOCK)
 *    - บังคับใช้ mock เพื่อเดโมหน้า Library บน production ได้ทันที
 *    - ไม่แตะ endpoint อื่น ทำให้ส่วนอื่นของระบบยังเรียก API ได้ตามปกติ
 *    - Library.jsx จะอ่านจาก user.orders ที่ UserContext preload มา
 *      (จึงเพียงต้องให้ getMyOrders() คืน mock orders ก็พอ)
 * ======================================================================= */
const USE_LIBRARY_MOCK = true;

// Helper: lazy import mock เพื่อให้ bundle หลักเล็กลง
async function importLibraryMock() {
  // NOTE: path จาก src/services → src/mocks
  const { getMockOrders } = await import("../mocks/libraryMock");
  const orders = getMockOrders();
  return Array.isArray(orders) ? orders : [];
}

export async function getMyOrders() {
  if (USE_LIBRARY_MOCK) {
    return importLibraryMock();
  }
  // (เผื่ออนาคตจะกลับมาใช้ API จริง)
  const { data } = await api.get("/users/orders");
  return data.orders || [];
}

export async function getOrderById(orderId) {
  if (USE_LIBRARY_MOCK) {
    const orders = await importLibraryMock();
    return orders.find((o) => String(o.id) === String(orderId)) || null;
  }
  const { data } = await api.get(`/orders/${orderId}`);
  return data.order;
}

/* =======================================================================
 * 4) Sessions (สำหรับหน้า Active Sessions)
 * ======================================================================= */
export async function getMySessions() {
  const { data } = await api.get("/users/sessions");
  return data.sessions || [];
}

export async function getCurrentSessionId() {
  // ตัวอย่าง response: { id: "sess_abc123" }
  const { data } = await api.get("/users/sessions/current");
  return data?.id || data?._id;
}

export async function revokeSession(sessionId, { password } = {}) {
  // รองรับ DELETE พร้อม body (บาง backend อาจต้องเปลี่ยนเป็น POST /revoke)
  if (password) {
    await api.delete(`/users/sessions/${sessionId}`, { data: { password } });
  } else {
    await api.delete(`/users/sessions/${sessionId}`);
  }
  return true;
}

export async function revokeSessionsBulk(sessionIds = [], password) {
  for (const id of sessionIds) {
    await revokeSession(id, { password });
  }
  return true;
}

/* =======================================================================
 * 5) Logout
 * ======================================================================= */
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data; // { message }
}
