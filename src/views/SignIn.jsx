
// // src/views/SignIn.jsx
// // หน้านี้ใช้ Nav/Footer จาก Layout (ไฟล์นี้แสดงเฉพาะคอนเทนต์)
// // ใช้ Tailwind + ตัวแปรสีจาก index.css ให้เห็น UI ชัดเจน

// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// export const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [ok, setOk] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setOk(false);

//     if (!email || !password) {
//       setError("Please fill in both email and password.");
//       return;
//     }

//     // TODO: เชื่อม API จริงภายหลัง
//     setSubmitting(true);
//     await new Promise((r) => setTimeout(r, 600)); // mock ให้เห็น UX
//     setSubmitting(false);
//     setOk(true);
//   }

//   return (
//     <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
//           <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
//             <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Sign In</h1>

//             {/* Email */}
//             <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
//             <input
//               id="email"
//               type="email"
//               placeholder="e.g. name@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                          text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                          focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//               required
//             />

//             {/* Password */}
//             <label htmlFor="password" className="block text-sm font-medium mt-5 mb-2">Password</label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Enter Your Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                          text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                          focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//               required
//             />

//             {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
//             {ok && !error && <p className="mt-3 text-sm" role="status">✅ Signed in (mock). Replace with real API later.</p>}

//             <button
//               type="submit"
//               disabled={submitting}
//               className="mt-6 w-full h-11 rounded-md font-semibold
//                          bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
//                          hover:opacity-90 disabled:opacity-60
//                          focus:outline-none focus-visible:ring-2
//                          focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
//             >
//               {submitting ? "Signing in..." : "Sign In"}
//             </button>

//             <div className="mt-5 text-center text-sm">
//               <Link to="/signup" className="hover:underline hover:opacity-90">Create account</Link>
//               <span className="mx-1 text-[color:var(--muted-foreground)]">|</span>
//               <Link to="/forgot-password" className="hover:underline hover:opacity-90">Forgot password?</Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };


// src/views/SignIn.jsx
// ✅ UI ธีมสีม่วง (ใช้ตัวแปรสีจาก index.css)
// ✅ คอมเมนต์ภาษาไทยอธิบายแต่ละส่วน
// ✅ export แบบ named

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function SignIn() {
  // ------------------------------
  // 📌 State เก็บค่าต่าง ๆ ของฟอร์ม
  // ------------------------------
  const [email, setEmail] = useState("");        // ค่า email
  const [password, setPassword] = useState("");  // ค่า password
  const [showPw, setShowPw] = useState(false);   // toggle แสดง/ซ่อนรหัสผ่าน
  const [error, setError] = useState("");        // ข้อความ error
  const [submitting, setSubmitting] = useState(false); // กันกดซ้ำตอน submit
  const [ok, setOk] = useState(false);           // เก็บสถานะ login สำเร็จ (mock)

  const navigate = useNavigate();

  // ------------------------------
  // 📌 ฟังก์ชัน handleSubmit (เมื่อกดปุ่ม Sign In)
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // trim email (กันเผลอเว้นวรรค) → แต่ไม่ trim password
    const emailValue = email.trim();
    const passwordValue = password;

    // ✅ ตรวจสอบว่ามีการกรอกหรือไม่
    if (!emailValue || !passwordValue) {
      setError("Please fill in both email and password.");
      return;
    }

    // ✅ ตรวจสอบความยาวรหัสผ่าน
    if (passwordValue.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ✅ ตรวจสอบว่าเป็นอีเมลที่ถูกต้อง
    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailLike.test(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ✅ reset state error/success ก่อนเริ่ม
    setError("");
    setOk(false);
    setSubmitting(true);

    try {
      // TODO: ตรงนี้จะเรียก API จริงในอนาคต
      await new Promise((r) => setTimeout(r, 600)); // mock async
      setOk(true);

      // ➡ หลัง login สำเร็จให้ redirect ไปหน้าแรก
      navigate("/", { replace: true });
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // ------------------------------
    // 📌 Layout: กล่องฟอร์มตรงกลาง + พื้นหลัง
    // ------------------------------
    <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 🔲 การ์ดสำหรับฟอร์ม */}
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
            
            {/* หัวข้อ */}
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Sign In
            </h1>

            {/* ---------------- Email ---------------- */}
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"                  // ใช้เพื่อช่วย password manager
              type="email"
              autoComplete="email"          // autoComplete email
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}        // a11y: แจ้ง screen reader ว่ามี error
              className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
                         text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
              required
            />

            {/* ---------------- Password ---------------- */}
            <label htmlFor="password" className="block text-sm font-medium mt-5 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"} // toggle show/hide
                autoComplete="current-password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}                // ต้องยาวอย่างน้อย 6 ตัว
                className="w-full h-11 pr-12 px-4 rounded-md border border-[color:var(--input)] bg-white
                           text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
                required
              />
              {/* ปุ่ม Show/Hide password */}
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto text-sm px-2 rounded hover:opacity-80"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            {/* ---------------- Error / Success message ---------------- */}
            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {ok && !error && (
              <p className="mt-3 text-sm" role="status">
                ✅ Signed in (mock). Replace with real API later.
              </p>
            )}

            {/* ---------------- ปุ่ม Sign In ---------------- */}
            <button
              type="submit"
              disabled={submitting}          // disable ตอนกำลังส่ง
              className="mt-6 w-full h-11 rounded-md font-semibold
                         bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
                         hover:opacity-90 disabled:opacity-60
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            {/* ---------------- ลิงก์ด้านล่าง ---------------- */}
            <div className="mt-5 text-center text-sm">
              {/* TODO: เปิดใช้เมื่อมี route /signup */}
              <Link to="/signup" className="hover:underline hover:opacity-90">
                Create account
              </Link>
              <span className="mx-1 text-[color:var(--muted-foreground)]">|</span>
              {/* TODO: เปิดใช้เมื่อมี route /forgot-password */}
              <Link to="/forgot-password" className="hover:underline hover:opacity-90">
                Forgot password?
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
