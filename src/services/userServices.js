// src/services/userServices.js
import api from "./api";

/* =========================
 * 1) Sign Up
 *  body: {
 *    email, password,
 *    fullName  (หรือ firstName + lastName),
 *    mobile,
 *    targetAge: { from, to },  // ช่วงอายุ 3–15
 *    agreeToPolicy: true
 *  }
 */
export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  // { user, message }
  return data;
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
 */
export async function signin({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  // { user, message }
  return data;
}

/* =========================
 * 3) Forgot Password
 *  body: { email }
 *  (ฝั่ง backend ตอบ generic message ป้องกัน account enumeration)
 */
export async function forgotPassword(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data; // { message }
}

/* =========================
 * 4) Reset Password
 *  body: { token, newPassword }
 */
export async function resetPassword({ token, newPassword }) {
  const { data } = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return data; // { message }
}

/* =========================
 * 5) Get Current User (อ่านจาก cookie)
 */
export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user; // sanitized user
}

/* =========================
 * 6) User Profile CRUD
 */

// 6.1 ดึงโปรไฟล์ตัวเอง
export async function getProfile() {
  const { data } = await api.get("/users");
  return data.user;
}

// 6.2 อัปเดตชื่อ/มือถือ/ช่วงอายุ (รองรับทั้ง targetAge{from,to} หรือ ageFrom/ageTo)
export async function updateProfileBasics(payload) {
  const { data } = await api.patch("/users", payload);
  return data.user;
}

// 6.3 อัปเดตที่อยู่
export async function updateAddress(addressPayload) {
  const { data } = await api.patch("/users/address", addressPayload);
  return data.user;
}

// 6.4 อัปเดตตัวเลือกการแจ้งเตือน
export async function updateNotifications(prefs) {
  const { data } = await api.patch("/users/notifications", prefs);
  return data.user;
}

// 6.5 Toggle newsletter
export async function toggleNewsletter(newsletter) {
  const { data } = await api.patch("/users/newsletter", {
    newsletter: !!newsletter,
  });
  return data.user;
}

// 6.6 จัดการ avatar
export async function updateAvatar(avatarUrl) {
  const { data } = await api.patch("/users/avatar", { avatarUrl });
  return data.user;
}
export async function removeAvatar() {
  const { data } = await api.delete("/users/avatar");
  return data.user;
}

// 6.7 เปลี่ยนรหัสผ่าน
export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await api.patch("/users/password", {
    currentPassword,
    newPassword,
  });
  return data; // { message }
}

/* =========================
 * (เสริม) Orders & Sessions
 */

// ดึงคำสั่งซื้อของตัวเอง
export async function getMyOrders() {
  const { data } = await api.get("/users/orders");
  return data.orders || [];
}

// รายละเอียดคำสั่งซื้อ
export async function getOrderById(orderId) {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.order;
}

// ดู sessions ที่เคยล็อกอิน
export async function getMySessions() {
  const { data } = await api.get("/users/sessions");
  return data.sessions || [];
}

// ลบ session ตาม id
export async function revokeSession(sessionId) {
  await api.delete(`/users/sessions/${sessionId}`);
  return true;
}

/* =========================
 * 7) Logout (ล้าง cookie)
 */
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data; // { message }
}
