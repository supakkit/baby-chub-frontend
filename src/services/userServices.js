// src/services/userServices.js
// NOTE(ไทย): ใช้ Axios instance จาก api.js ซึ่งเลือก baseURL จาก VITE_* และเปิด withCredentials แล้ว
import api from "./api";

/* =========================
 * 1) Sign Up
 *  body: {
 *    email, password,
 *    fullName (หรือ firstName + lastName),
 *    mobile,
 *    targetAge: { from, to },  // ช่วงอายุ 3–15
 *    agreeToPolicy: true
 *  }
 * ========================= */
export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data; // { user, message }
}

// resend verify mail
export async function resendVerification(email) {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data; // { message: "If email exists, verification mail was sent." }
}

/* =========================
 * 2) Sign In
 *  body: { email, password }
 *  สำเร็จแล้ว backend เซ็ต httpOnly cookie: accessToken
 * ========================= */
export async function signin({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { user, message }
}

/* =========================
 * 3) Forgot / Reset Password
 * ========================= */
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

/* =========================
 * 5) Get Current User (อ่านจาก cookie)
 * ========================= */
export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user; // sanitized user
}

/* =========================
 * 6) User Profile CRUD
 * ========================= */
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

/* =========================
 * (เสริม) Orders
 * ========================= */
export async function getMyOrders() {
  const { data } = await api.get("/users/orders");
  return data.orders || [];
}
export async function getOrderById(orderId) {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.order;
}

/* =========================
 * Sessions API (สำหรับหน้า Active sessions)
 * ========================= */

// NOTE(ไทย): ดึงทุก session ของผู้ใช้ปัจจุบัน (ฝั่ง backend อ่านจาก cookie)
export async function getMySessions() {
  const { data } = await api.get("/users/sessions");
  return data.sessions || [];
}

// NOTE(ไทย): ดึง session id ปัจจุบันของแท็บ/อุปกรณ์นี้ เพื่อนำไปติดป้าย "This device"
export async function getCurrentSessionId() {
  // แนะนำให้ backend ทำ endpoint นี้
  // ตัวอย่าง response: { id: "sess_abc123" }
  const { data } = await api.get("/users/sessions/current");
  return data?.id || data?._id;
}

// NOTE(ไทย): เพิกถอน session แบบเดี่ยว โดยต้องใส่ password เพื่อยืนยัน
// - ถ้า backend รองรับ DELETE พร้อม body ให้ใช้ data:{password} แบบนี้ได้
// - ถ้า backend ไม่รองรับ DELETE body: เปลี่ยนไปใช้ POST /users/sessions/:id/revoke แทน
export async function revokeSession(sessionId, { password } = {}) {
  if (password) {
    await api.delete(`/users/sessions/${sessionId}`, {
      data: { password },
    });
  } else {
    await api.delete(`/users/sessions/${sessionId}`);
  }
  return true;
}

// NOTE(ไทย): เพิกถอนหลาย session (ทำทีละอันจากฝั่ง frontend)
// - ถ้าอยากลดจำนวน request: ทำ endpoint bulk บน backend แล้วรวมเรียกทีเดียว
export async function revokeSessionsBulk(sessionIds = [], password) {
  for (const id of sessionIds) {
    await revokeSession(id, { password });
  }
  return true;
}

/* =========================
 * 7) Logout (ล้าง cookie)
 * ========================= */
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data; // { message }
}
