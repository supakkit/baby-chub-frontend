// src/views/ResetPassword.jsx
// ✅ ใช้ token จาก query string (?token=...)
// ✅ ตรวจฟอร์ม: ความยาว ≥ 8, ตรงกันทั้งสองช่อง
// ✅ เรียก service จริง: POST /auth/reset-password
// ✅ แสดง error จากเซิร์ฟเวอร์ เช่น "Invalid or expired token"
// ✅ สำเร็จแล้วโชว์ปุ่มไป Sign In

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/userServices";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // ถ้าไม่มี token ให้เด้งกลับหน้า forgot
    if (!token) navigate("/forgot-password", { replace: true });
  }, [token, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword: password }); // 🔗 POST /auth/reset-password
      setDone(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not reset your password. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-4 rounded-md border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] px-4 py-3 shadow-sm">
            <div className="font-semibold">Password updated</div>
            <p className="text-sm mt-1">
              Your password has been reset successfully.
            </p>
          </div>

          <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm p-6 md:p-8 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center justify-center h-11 px-6 rounded-md font-semibold
                         bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
                         hover:opacity-90 focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form onSubmit={onSubmit} className="p-6 md:p-8" noValidate>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Set a new password
            </h1>

            {/* Password */}
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your new password"
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
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm */}
            <label
              htmlFor="confirm"
              className="block text-sm font-medium mt-5 mb-2"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter the new password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
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
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto text-sm px-2 rounded hover:opacity-80"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>

            {/* Error */}
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
              {submitting ? "Updating..." : "Update Password"}
            </button>

            <div className="mt-5 text-center text-sm">
              <Link to="/signin" className="hover:underline hover:opacity-90">
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
