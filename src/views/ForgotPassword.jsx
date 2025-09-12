// src/views/ForgotPassword.jsx
// ✅ เรียก backend จริงผ่าน service: forgotPassword(email)
// ✅ แสดง generic success message (ป้องกัน account enumeration)
// ✅ a11y: โฟกัสไปที่ banner เมื่อสำเร็จ

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/userServices"; // ← ใช้ service จริง

export function ForgotPassword() {
  // -----------------------------
  // 📌 State ฟอร์ม + สถานะ/ผลลัพธ์
  // -----------------------------
  const [email, setEmail] = useState(""); // อีเมลที่ผู้ใช้กรอก
  const [submitting, setSubmitting] = useState(false); // กันกดซ้ำ/สถานะโหลด
  const [msg, setMsg] = useState({ type: "", text: "" }); // "ok" | "error" | "" (ข้อความผลลัพธ์)
  const bannerRef = useRef(null); // โฟกัสไปที่ banner หลังส่งสำเร็จ
  const navigate = useNavigate();

  // 🔎 regex พื้นฐานสำหรับตรวจอีเมล
  const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // -----------------------------
  // 📨 Submit Handler (เรียก service จริง)
  // -----------------------------
  const onSubmit = async (e) => {
    e.preventDefault();

    // เคลียร์ข้อความก่อนหน้า
    setMsg({ type: "", text: "" });

    // Trim แล้วยืนยันรูปแบบอีเมล (กันยิง API เก้อ)
    const emailTrim = email.trim();
    if (!emailTrim || !emailLike.test(emailTrim)) {
      setMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(emailTrim); // 🔗 POST /auth/forgot-password

      // ✅ แสดงข้อความสำเร็จ "generic"
      setMsg({
        type: "ok",
        text: "If the email is registered, we’ve sent a password reset link. Please check your inbox (and spam).",
      });
    } catch {
      // แม้เกิดข้อผิดพลาดเครือข่าย ก็ยังคงตอบ generic message เพื่อความปลอดภัย
      setMsg({
        type: "ok",
        text: "If the email is registered, we’ve sent a password reset link. Please check your inbox (and spam).",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // a11y: โฟกัสไปที่ banner เมื่อมีข้อความ (ช่วย screen reader)
  useEffect(() => {
    if (msg.text && bannerRef.current) {
      bannerRef.current.focus();
    }
  }, [msg]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* ✅ Success Banner (generic) — โทน popover เดียวกับหน้า SignUp */}
        {msg.type === "ok" && (
          <div
            ref={bannerRef}
            tabIndex={-1}
            className="mb-4 rounded-md border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] px-4 py-3 shadow-sm outline-none"
            role="status"
            aria-live="polite"
          >
            <div className="font-semibold">Password reset link sent</div>
            <p className="text-sm mt-1">{msg.text}</p>
          </div>
        )}

        {/* 🔲 การ์ดฟอร์ม — โครง/สีกลมกลืนกับ SignIn/SignUp */}
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form
            onSubmit={onSubmit}
            className="p-6 md:p-8"
            noValidate
            aria-busy={submitting}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-1">
              Reset your password
            </h1>
            <p className="text-center text-sm mb-6 opacity-80">
              We will send you an email to reset your password
            </p>

            {/* ---------------- Email ---------------- */}
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={msg.type === "error"}
              aria-describedby="fp-msg"
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />

            {/* ข้อความ error (validation) / status (อื่นๆ) — ใช้ aria-live */}
            {msg.text && msg.type !== "ok" && (
              <p
                id="fp-msg"
                className={`mt-3 text-sm ${
                  msg.type === "error" ? "text-[color:var(--destructive)]" : ""
                }`}
                role={msg.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {msg.text}
              </p>
            )}

            {/* ---------------- ปุ่ม Submit ---------------- */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full h-11 rounded-md font-semibold
                         bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
                         hover:opacity-90 disabled:opacity-60
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
            >
              {submitting ? "Sending..." : "Submit"}
            </button>

            {/* ---------------- ปุ่ม Cancel ---------------- */}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="mt-3 w-full h-11 rounded-md border border-[color:var(--input)]
                         hover:opacity-90
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
