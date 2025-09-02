// src/views/SignIn.jsx
// Sign in (mock): Calls login() from UserContext then navigates to /profile
// In production: Replace TODO with real API calls

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ Uses login() to set user.id for ProtectedRoute

export function SignIn() {
  // ------------------------------
  // 📌 Form state
  // ------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser(); // ✅ from context

  // ------------------------------
  // 📌 Submit handler
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValue = email.trim();
    const passwordValue = password;

    // Simple client-side validation
    if (!emailValue || !passwordValue) {
      setError("Please fill in both email and password.");
      return;
    }
    if (passwordValue.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailLike.test(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      // TODO (prod): POST /auth/login -> httpOnly cookie -> GET /auth/me
      // For now, use context mock: ensures user.id exists
      await new Promise((r) => setTimeout(r, 400)); // small mock delay
      await login({ email: emailValue }); // ✅ creates user.id

      // ✅ After successful sign-in, redirect back to the originally intended route (if any); otherwise go to /profile
      navigate(location.state?.from?.pathname ?? "/profile", { replace: true });
    } catch (err) {
      setError(err?.message || "Sign in failed. Please try again.");
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

            {/* Email field */}
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
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />

            {/* Password field */}
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
                placeholder="Enter Your Password "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {/* Submit button */}
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
