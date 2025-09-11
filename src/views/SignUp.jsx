// src/views/SignUp.jsx
// -------------------------------------------------------------
// ✅ เปลี่ยนช่วงอายุจาก 1–20 → เป็น 3–15 (เท่านั้น)
//    - กำหนด AGE_MIN/AGE_MAX = 3/15
//    - เปลี่ยน <input number> ให้ min/max = 3/15
//    - ปรับ validation และ helper text ให้สอดคล้อง
// ⚠️ ส่วนอื่น (ฟิลด์/โครง UI/flow modal/payload) คงเดิม
// -------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// (ทางเลือก) ตั้งค่าฐาน API จาก .env เมื่อเชื่อมจริง
const API_BASE = import.meta.env?.VITE_API_BASE_URL;

// ✅ ค่าคงที่ช่วงอายุใหม่
const AGE_MIN = 3;
const AGE_MAX = 15;

export function SignUp() {
  // -----------------------------
  // 📌 State ฟอร์ม
  // -----------------------------
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Target Groups (ช่วงอายุ 3–15)
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");

  // Checkbox ยอมรับนโยบาย/เงื่อนไข
  const [agree, setAgree] = useState(false);

  // -----------------------------
  // 📌 State สถานะ/ผลลัพธ์
  // -----------------------------
  const [submitting, setSubmitting] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [bannerOpen, setBannerOpen] = useState(false);

  const [err, setErr] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    age: "",
    agree: "",
    submit: "",
  });

  // -----------------------------
  // 🧩 Modal: เปิดอ่าน Privacy & Terms
  // -----------------------------
  const [showPolicy, setShowPolicy] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowPolicy(false);
    if (showPolicy) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPolicy]);

  // -----------------------------
  // 🔎 Validate
  // -----------------------------
  const validate = () => {
    const next = {
      fullName: "",
      mobile: "",
      email: "",
      password: "",
      age: "",
      agree: "",
      submit: "",
    };

    // ชื่อ-นามสกุล
    const nameTrim = fullName.trim();
    if (!nameTrim) next.fullName = "Please enter your first and last name";

    // เบอร์มือถือ (pattern หลวม ๆ)
    const mobileTrim = mobile.trim();
    if (!mobileTrim) {
      next.mobile = "Please enter your mobile number";
    } else {
      const mobileLike = /^[0-9+\-\s]{6,20}$/;
      if (!mobileLike.test(mobileTrim))
        next.mobile = "Please enter a valid mobile number";
    }

    // อีเมล
    const emailTrim = email.trim();
    if (!emailTrim) {
      next.email = "Please enter your email";
    } else {
      const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailLike.test(emailTrim))
        next.email = "Please enter a valid email address";
    }

    // รหัสผ่าน
    if (!password) next.password = "Please enter your password";
    else if (password.length < 8)
      next.password = "Password must be at least 8 characters";

    // ✅ ช่วงอายุ 3–15 และ from ≤ to
    const aFrom = Number(ageFrom);
    const aTo = Number(ageTo);
    if (!ageFrom || !ageTo) {
      next.age = "Please fill in both age fields";
    } else if (Number.isNaN(aFrom) || Number.isNaN(aTo)) {
      next.age = "Age must be a valid number";
    } else if (
      aFrom < AGE_MIN ||
      aFrom > AGE_MAX ||
      aTo < AGE_MIN ||
      aTo > AGE_MAX
    ) {
      next.age = `Please enter a number between ${AGE_MIN} and ${AGE_MAX} only`;
    } else if (aFrom > aTo) {
      next.age = "The starting age must be less than or equal to the ending age";
    }

    // ต้องยอมรับนโยบาย
    if (!agree)
      next.agree = "You must agree to the Privacy Policy and Terms of Service";

    setErr(next);
    return Object.values(next).every((v) => v === "");
  };

  // พฤติกรรม checkbox: เปิด modal เมื่อกดติ๊กครั้งแรก
  const onAgreeToggle = (e) => {
    const wantToCheck = e.target.checked;
    if (wantToCheck && !agree) {
      setShowPolicy(true);
      return;
    }
    setAgree(wantToCheck);
  };
  const confirmAgreeFromModal = () => {
    setAgree(true);
    setShowPolicy(false);
  };

  // -----------------------------
  // 📨 Submit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerOpen(false);
    setSuccessEmail("");
    setErr((o) => ({ ...o, submit: "" }));

    if (!validate()) return;

    setSubmitting(true);
    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 12000);

    try {
      const payload = {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        password,
        targetAge: { from: Number(ageFrom), to: Number(ageTo) },
        agreeToPolicy: agree,
      };

      // TODO: ใช้ API จริงเมื่อพร้อม
      // const res = await fetch(`${API_BASE}/auth/signup`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      //   signal: ac.signal,
      //   credentials: "include",
      // });
      // clearTimeout(timeoutId);
      // if (!res.ok) { ...handle errors... }

      // MOCK ชั่วคราว
      await new Promise((r) => setTimeout(r, 800));
      clearTimeout(timeoutId);

      setSuccessEmail(email.trim());
      setBannerOpen(true);
    } catch (err0) {
      if (err0?.name === "AbortError") {
        setErr((o) => ({ ...o, submit: "Request timed out. Please try again." }));
      } else {
        setErr((o) => ({ ...o, submit: "Sign up failed. Please try again." }));
      }
    } finally {
      clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  // รับพารามิเตอร์ redirect จาก query (ถ้ามี)
  const [searchParams] = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") || "", [searchParams]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* ✅ Banner: ให้ไปเช็คอีเมลเพื่อ verify */}
        {bannerOpen && (
          <div className="mb-4 rounded-md border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] px-4 py-3 shadow-sm">
            <div className="font-semibold">Account created</div>
            <p className="text-sm mt-1">
              We’ve sent a verification link to <strong>{successEmail}</strong>.
            </p>
            <p className="text-sm">Please check your inbox (and spam).</p>
            <button
              type="button"
              className="mt-2 text-sm underline hover:opacity-80"
              onClick={() => setBannerOpen(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* การ์ดแบบฟอร์ม */}
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Create an account
            </h1>

            {/* Full Name */}
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              First Name / Last Name
            </label>
            <input
              id="fullName"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={!!err.fullName}
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />
            {err.fullName && (
              <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">
                {err.fullName}
              </p>
            )}

            {/* Mobile */}
            <label htmlFor="mobile" className="block text-sm font-medium mt-5 mb-2">
              Mobile number
            </label>
            <input
              id="mobile"
              name="tel"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. +66 8x-xxx-xxxx"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              aria-invalid={!!err.mobile}
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />
            {err.mobile && (
              <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">
                {err.mobile}
              </p>
            )}

            {/* Email */}
            <label htmlFor="email" className="block text-sm font-medium mt-5 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!err.email}
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />
            {err.email && (
              <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">
                {err.email}
              </p>
            )}

            {/* Password */}
            <label htmlFor="password" className="block text-sm font-medium mt-5 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="new-password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                aria-invalid={!!err.password}
                className="w-full h-11 pr-12 px-4 rounded-md border border-[color:var(--input)] bg-white
                           text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 my-auto text-sm px-2 rounded hover:opacity-80"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {err.password && (
              <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">
                {err.password}
              </p>
            )}

            {/* ✅ Target Groups (Age range 3–15) */}
            <label className="block text-sm font-medium mt-5 mb-2">
              Target Groups (Age range)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="ageFrom"
                name="age-from"
                type="number"
                inputMode="numeric"
                min={AGE_MIN}
                max={AGE_MAX}
                step={1}
                placeholder="From"
                value={ageFrom}
                onChange={(e) => setAgeFrom(e.target.value)}
                aria-invalid={!!err.age}
                className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                           text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
                required
              />
              <span className="text-[color:var(--muted-foreground)]">–</span>
              <input
                id="ageTo"
                name="age-to"
                type="number"
                inputMode="numeric"
                min={AGE_MIN}
                max={AGE_MAX}
                step={1}
                placeholder="To"
                value={ageTo}
                onChange={(e) => setAgeTo(e.target.value)}
                aria-invalid={!!err.age}
                className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                           text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
                required
              />
            </div>
            {err.age && (
              <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">
                {err.age}
              </p>
            )}
            <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
              Allowed age range: {AGE_MIN}–{AGE_MAX} years old.
            </p>

            {/* Agree to Policy / Terms */}
            <div className="mt-5 flex items-start gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={onAgreeToggle}
                aria-invalid={!!err.agree}
                className="mt-1"
                required
              />
              <label htmlFor="agree" className="text-sm">
                I agree to the{" "}
                <button
                  type="button"
                  className="underline hover:opacity-80"
                  onClick={() => setShowPolicy(true)}
                >
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="underline hover:opacity-80"
                  onClick={() => setShowPolicy(true)}
                >
                  Terms of Service
                </button>
                .
              </label>
            </div>
            {err.agree && (
              <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">
                {err.agree}
              </p>
            )}

            <p className="mt-3 text-xs text-[color:var(--muted-foreground)]">
              After creating an account, we will send a verification link to your
              email. Please verify before signing in.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full h-11 rounded-md font-semibold
                         bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
                         hover:opacity-90 disabled:opacity-60
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
            >
              {submitting ? "Creating..." : "Create Account"}
            </button>

            {/* Footer link */}
            <div className="mt-5 text-center text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="underline hover:opacity-90">
                Login
              </Link>
            </div>

            {/* Error ระดับ submit */}
            {err.submit && (
              <p className="mt-3 text-sm text-[color:var(--destructive)] text-center" role="alert">
                {err.submit}
              </p>
            )}
          </form>
        </div>

        {/* =================== MODAL (อ่านนโยบาย) =================== */}
        {showPolicy && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPolicy(false);
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] shadow-lg">
              <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
                <h2 id="policy-title" className="text-lg font-semibold">
                  Privacy Policy & Terms of Service
                </h2>
                <button
                  type="button"
                  className="text-sm underline hover:opacity-80"
                  onClick={() => setShowPolicy(false)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <div className="px-5 py-4 overflow-y-auto max-h-[65vh] text-sm leading-6">
                {/* … เนื้อหาเดียวกับเดิม … */}
                <p className="mb-3">
                  We value your privacy and security. By creating an account and
                  using our services, you agree to the following policy and terms.
                </p>
                {/* (ย่อเนื้อหา นโยบายตามไฟล์เดิม) */}
              </div>

              <div className="px-5 py-3 border-t border-[color:var(--border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 h-9 rounded-md border border-[color:var(--input)] hover:opacity-90"
                  onClick={() => setShowPolicy(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="px-4 h-9 rounded-md font-semibold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90"
                  onClick={confirmAgreeFromModal}
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
        )}
        {/* =================== /MODAL =================== */}
      </div>
    </div>
  );
}
