// src/views/ForgotPassword.jsx
// ✅ จุดประสงค์ไฟล์:
//    - ฟอร์ม "ลืมรหัสผ่าน" (Forgot Password) ให้ผู้ใช้กรอกอีเมล
//    - ตรวจรูปแบบอีเมลฝั่งหน้าเว็บ (regex)
//    - เรียก API POST /auth/forgot-password { email } (ถ้ากำหนด API_BASE) หรือ mock ระหว่างรอ backend
//    - ระหว่างส่งคำขอ: ปุ่ม disabled + กันกดซ้ำ + ตั้ง timeout กันแฮง
//    - แสดงผลแบบ "generic success" เพื่อป้องกัน account enumeration (ไม่บอกว่าอีเมลมี/ไม่มีในระบบ)
//    - โทน UI/spacing/การ์ดเหมือนหน้า SignIn/SignUp (ใช้ตัวแปรสีจาก index.css)
//    - a11y: aria-invalid, aria-live, โฟกัสไปที่ banner เมื่อสำเร็จ

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ⛳️ (ทางเลือก) ดึงค่า API_BASE จาก .env (ให้สอดคล้องกับหน้า SignUp)
const API_BASE = import.meta.env?.VITE_API_BASE_URL;

export function ForgotPassword() {
  // -----------------------------
  // 📌 State ฟอร์ม + สถานะ/ผลลัพธ์
  // -----------------------------
  const [email, setEmail] = useState("");                 // อีเมลที่ผู้ใช้กรอก
  const [submitting, setSubmitting] = useState(false);    // กันกดซ้ำ/สถานะโหลด
  const [msg, setMsg] = useState({ type: "", text: "" }); // "ok" | "error" | "" (ข้อความผลลัพธ์)
  const bannerRef = useRef(null);                         // โฟกัสไปที่ banner หลังส่งสำเร็จ
  const navigate = useNavigate();

  // -----------------------------
  // 🔎 regex พื้นฐานสำหรับตรวจอีเมล (เหมือนแนวใน SignUp)
  // -----------------------------
  const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // -----------------------------
  // 📨 Submit Handler
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

    // ✅ ตั้ง timeout กันแฮง (เหมือนลอจิกหน้า SignUp): ตัดคำขอใน 12 วินาที
    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 12000);

    try {
      // ==================================
      // 🔗 เรียก API จริง (ถ้ามี API_BASE)
      // ==================================
      if (API_BASE) {
        // หมายเหตุ: ฝั่ง backend ควรตอบ 200 เสมอ (generic) เพื่อลด account enumeration
        await fetch(`${API_BASE}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailTrim }),
          signal: ac.signal,
          credentials: "include", // ถ้า backend ใช้ cookie/CSRf
        }).catch(() => {
          // ไม่ต้องโยน error ต่อ: เราจะแสดงผลแบบ generic อยู่แล้ว
        });
      } else {
        // =============================
        // 🔁 MOCK ระหว่างรอ backend
        // =============================
        await new Promise((r) => setTimeout(r, 800));
      }

      clearTimeout(timeoutId);

      // ✅ แสดงข้อความสำเร็จ "generic" (ป้องกันบอกใบ้ว่ามี/ไม่มีอีเมลในระบบ)
      setMsg({
        type: "ok",
        text:
          "If the email is registered, we’ve sent a password reset link. Please check your inbox (and spam).",
      });
    } catch (err) {
      // แม้เกิดข้อผิดพลาดเครือข่าย ก็ยังคงตอบ generic message เพื่อความปลอดภัย
      setMsg({
        type: "ok",
        text:
          "If the email is registered, we’ve sent a password reset link. Please check your inbox (and spam).",
      });
    } finally {
      clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  // -----------------------------
  // 🧭 a11y: โฟกัสไปที่ banner เมื่อมีข้อความ (ช่วย screen reader)
  // -----------------------------
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
            <p className="text-sm mt-1">
              {msg.text}
            </p>
          </div>
        )}

        {/* 🔲 การ์ดฟอร์ม — โครง/สีกลมกลืนกับ SignIn/SignUp */}
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form onSubmit={onSubmit} className="p-6 md:p-8" noValidate aria-busy={submitting}>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-1">Reset your password</h1>
            <p className="text-center text-sm mb-6 opacity-80">
              We will send you an email to reset your password
            </p>

            {/* ---------------- Email ---------------- */}
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
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
                className={`mt-3 text-sm ${msg.type === "error" ? "text-[color:var(--destructive)]" : ""}`}
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
