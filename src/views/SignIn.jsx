// src/views/SignIn.jsx

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser(); // login({ email, password })

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValue = email.trim();
    const passwordValue = password;

    // basic client-side validation
    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !passwordValue) {
      setError("Please fill in both email and password.");
      return;
    }
    if (!emailLike.test(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (passwordValue.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await login({ email: emailValue, password: passwordValue });
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (err) {
      // ---- Error mapping (industry-standard generic) ----
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;

      let msg =
        serverMsg || err?.message || "Sign in failed. Please try again.";

      // 401 Unauthorized → generic ไม่เปิดเผยว่าเมลหรือพาสผิด
      if (status === 401) {
        msg = "Email or password is incorrect.";
      }
      // 403 Forbidden → โดยทั่วไปคือยังไม่ยืนยันอีเมล (ถ้าหลังบ้านตั้งไว้)
      else if (status === 403) {
        msg =
          serverMsg ||
          "Your account isn’t verified yet. Please check your email for a verification link.";
      }
      // 429/423 → พยายามมากเกินไป/ถูกล็อกชั่วคราว
      else if (status === 429 || status === 423) {
        msg = "Too many attempts. Please try again later.";
      }
      // Network error (ไม่มี response เลย)
      else if (!err?.response) {
        msg =
          "Can’t reach the server. Please check your connection and try again.";
      }
      // 5xx → ปัญหาที่ฝั่งเรา
      else if (status >= 500) {
        msg = "Something went wrong on our side. Please try again.";
      }

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Sign In
            </h1>

            {/* Email */}
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); // เคลียร์ error เมื่อผู้ใช้แก้ฟิลด์
              }}
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />

            {/* Password */}
            <label
              htmlFor="password"
              className="block text-sm font-medium mt-5 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                minLength={8}
                className="w-full h-11 pr-12 px-4 rounded-md border border-[color:var(--input)] bg-white
                           text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto text-sm px-2 rounded hover:opacity-80"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p
                className="mt-3 text-sm text-[color:var(--destructive)]"
                role="alert"
              >
                {error}
              </p>
            )}

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
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            {/* Links */}
            <div className="mt-5 text-center text-sm">
              <Link to="/signup" className="hover:underline hover:opacity-90">
                Create account
              </Link>
              <span className="mx-1 text-[color:var(--muted-foreground)]">
                |
              </span>
              <Link
                to="/forgot-password"
                className="hover:underline hover:opacity-90"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
