
// // src/views/SignUp.jsx

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export function SignUp() {
//   // -----------------------------
//   // 📌 State ฟิลด์ฟอร์ม
//   // -----------------------------
//   const [fullName, setFullName] = useState("");     // First/Last name (ช่องเดียว)
//   const [mobile, setMobile] = useState("");         // Mobile number
//   const [email, setEmail] = useState("");           // Email address
//   const [password, setPassword] = useState("");     // Password
//   const [showPw, setShowPw] = useState(false);      // toggle แสดง/ซ่อนรหัสผ่าน

//   // Target Groups (ช่วงอายุ 1–20)
//   const [ageFrom, setAgeFrom] = useState("");
//   const [ageTo, setAgeTo] = useState("");

//   // Checkbox ยอมรับนโยบาย/เงื่อนไข (จะติ๊กเองหลัง user กด I Agree ใน modal)
//   const [agree, setAgree] = useState(false);

//   // -----------------------------
//   // 📌 State แสดงผล/สถานะ
//   // -----------------------------
//   const [submitting, setSubmitting] = useState(false); // กันกดซ้ำ
//   const [successEmail, setSuccessEmail] = useState(""); // สำหรับ success banner
//   const [bannerOpen, setBannerOpen] = useState(false);  // แสดง success banner

//   // Error รายฟิลด์
//   const [err, setErr] = useState({
//     fullName: "",
//     mobile: "",
//     email: "",
//     password: "",
//     age: "",
//     agree: "",
//     submit: "",
//   });

//   const navigate = useNavigate();

//   // -----------------------------
//   // 🧩 Modal: เปิดอ่าน Privacy & Terms (รวมไฟล์เดียว)
//   // -----------------------------
//   const [showPolicy, setShowPolicy] = useState(false);

//   // ปิด modal ด้วยปุ่ม ESC (quality-of-life)
//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && setShowPolicy(false);
//     if (showPolicy) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [showPolicy]);

//   // -----------------------------
//   // 🔎 ฟังก์ชันช่วย validate
//   // -----------------------------
//   const validate = () => {
//     const next = { fullName: "", mobile: "", email: "", password: "", age: "", agree: "", submit: "" };

//     // ชื่อ-นามสกุล
//     const nameTrim = fullName.trim();
//     if (!nameTrim) next.fullName = "Please enter your first and last name";

//     // เบอร์มือถือ (pattern หลวม ๆ)
//     const mobileTrim = mobile.trim();
//     if (!mobileTrim) {
//       next.mobile = "Please enter your mobile number";
//     } else {
//       const mobileLike = /^[0-9+\-\s]{6,20}$/;
//       if (!mobileLike.test(mobileTrim)) next.mobile = "Please enter a valid mobile number";
//     }

//     // อีเมล
//     const emailTrim = email.trim();
//     if (!emailTrim) {
//       next.email = "Please enter your email";
//     } else {
//       const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailLike.test(emailTrim)) next.email = "Please enter a valid email address";
//     }

//     // รหัสผ่าน (>= 6)
//     if (!password) next.password = "Please enter your password";
//     else if (password.length < 6) next.password = "Password must be at least 6 characters";

//     // ช่วงอายุ 1–20 และ from ≤ to
//     const aFrom = Number(ageFrom);
//     const aTo = Number(ageTo);
//     if (!ageFrom || !ageTo) {
//       next.age = "Please fill in both age fields";
//     } else if (Number.isNaN(aFrom) || Number.isNaN(aTo)) {
//       next.age = "Please enter a number between 1 and 20 only";
//     } else if (aFrom < 1 || aFrom > 20 || aTo < 1 || aTo > 20) {
//       next.age = "Please enter a number between 1 and 20 only";
//     } else if (aFrom > aTo) {
//       next.age = "The starting age must be less than or equal to the ending age";
//     }

//     // ต้องติ๊ก agree
//     if (!agree) next.agree = "You must agree to the Privacy Policy and Terms of Service";

//     setErr(next);
//     return Object.values(next).every((v) => v === "");
//   };

//   // -----------------------------
//   // 📨 Submit Handler
//   // -----------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBannerOpen(false);
//     setSuccessEmail("");
//     setErr((o) => ({ ...o, submit: "" }));

//     if (!validate()) return;

//     setSubmitting(true);
//     try {
//       // TODO: เรียก API สมัครสมาชิกจริงที่นี่
//       await new Promise((r) => setTimeout(r, 800)); // mock async

//       // เปิด success banner (ใช้ email ที่กรอก)
//       setSuccessEmail(email.trim());
//       setBannerOpen(true);

//       // จะ redirect ก็ได้:
//       // navigate("/", { replace: true });
//     } catch (e1) {
//       setErr((o) => ({ ...o, submit: "Sign up failed. Please try again." }));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // -----------------------------
//   // 🧠 พฤติกรรม checkbox ใหม่:
//   // - ถ้า user "พยายามติ๊ก" ครั้งแรก → เปิด modal (แต่ยังไม่ setAgree)
//   // - เมื่อ user กด I Agree ใน modal → ค่อย setAgree(true) + ปิด modal
//   // - ถ้า user "เอาติ๊กออก" → setAgree(false) ตามปกติ
//   // -----------------------------
//   const onAgreeToggle = (e) => {
//     const wantToCheck = e.target.checked;
//     if (wantToCheck && !agree) {
//       // ผู้ใช้กดติ๊กครั้งแรก → เปิด modal ให้ยืนยันก่อน
//       setShowPolicy(true);
//       // ไม่ setAgree ที่นี่ เพราะยังไม่ได้อ่าน/ยืนยันใน modal
//       return;
//     }
//     // ผู้ใช้เอาติ๊กออก หรือกรณีอื่น ๆ → อัปเดตสถานะตรง ๆ
//     setAgree(wantToCheck);
//   };

//   const confirmAgreeFromModal = () => {
//     // user กด I Agree ใน modal → auto-check กล่อง
//     setAgree(true);
//     setShowPolicy(false);
//   };

//   return (
//     <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">

//         {/* ✅ Success Banner (โทน popover) */}
//         {bannerOpen && (
//           <div className="mb-4 rounded-md border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] px-4 py-3 shadow-sm">
//             <div className="font-semibold">Account created successfully</div>
//             <p className="text-sm mt-1">
//               We've sent a confirmation link to your registered email address: <strong>{successEmail}</strong>.
//             </p>
//             <p className="text-sm">Please check your inbox (and spam/junk folder) to verify your account.</p>
//             <p className="text-sm">If you don't receive the email within a few minutes, try signing up again or contact support.</p>
//             <button type="button" className="mt-2 text-sm underline hover:opacity-80" onClick={() => setBannerOpen(false)}>
//               Dismiss
//             </button>
//           </div>
//         )}

//         {/* 🔲 การ์ดแบบฟอร์ม */}
//         <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
//           <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
//             <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Create an account</h1>

//             {/* ---------------- Full Name ---------------- */}
//             <label htmlFor="fullName" className="block text-sm font-medium mb-2">First Name / Last Name</label>
//             <input
//               id="fullName"
//               name="name"
//               type="text"
//               autoComplete="name"
//               placeholder="e.g. Jane Doe"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               aria-invalid={!!err.fullName}
//               className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                          text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                          focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//               required
//             />
//             {err.fullName && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.fullName}</p>}

//             {/* ---------------- Mobile Number ---------------- */}
//             <label htmlFor="mobile" className="block text-sm font-medium mt-5 mb-2">Mobile number</label>
//             <input
//               id="mobile"
//               name="tel"
//               type="tel"
//               autoComplete="tel"
//               placeholder="e.g. +66 8x-xxx-xxxx"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               aria-invalid={!!err.mobile}
//               className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                          text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                          focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//               required
//             />
//             {err.mobile && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.mobile}</p>}

//             {/* ---------------- Email Address ---------------- */}
//             <label htmlFor="email" className="block text-sm font-medium mt-5 mb-2">Email address</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               placeholder="e.g. name@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               aria-invalid={!!err.email}
//               className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                          text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                          focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//               required
//             />
//             {err.email && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.email}</p>}

//             {/* ---------------- Password ---------------- */}
//             <label htmlFor="password" className="block text-sm font-medium mt-5 mb-2">Password</label>
//             <div className="relative">
//               <input
//                 id="password"
//                 name="new-password"
//                 type={showPw ? "text" : "password"}
//                 autoComplete="new-password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 minLength={6}
//                 aria-invalid={!!err.password}
//                 className="w-full h-11 pr-12 px-4 rounded-md border border-[color:var(--input)] bg-white
//                            text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                            focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-2 my-auto text-sm px-2 rounded hover:opacity-80"
//                 onClick={() => setShowPw((s) => !s)}
//                 aria-label={showPw ? "Hide password" : "Show password"}
//               >
//                 {showPw ? "Hide" : "Show"}
//               </button>
//             </div>
//             {err.password && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.password}</p>}

//             {/* ---------------- Target Groups (Age range 1–20) ---------------- */}
//             <label className="block text-sm font-medium mt-5 mb-2">Target Groups (Age range)</label>
//             <div className="flex items-center gap-2">
//               <input
//                 id="ageFrom"
//                 name="age-from"
//                 type="number"
//                 inputMode="numeric"
//                 min={1}
//                 max={20}
//                 step={1}
//                 placeholder="From"
//                 value={ageFrom}
//                 onChange={(e) => setAgeFrom(e.target.value)}
//                 aria-invalid={!!err.age}
//                 className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                            text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                            focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//                 required
//               />
//               <span className="text-[color:var(--muted-foreground)]">–</span>
//               <input
//                 id="ageTo"
//                 name="age-to"
//                 type="number"
//                 inputMode="numeric"
//                 min={1}
//                 max={20}
//                 step={1}
//                 placeholder="To"
//                 value={ageTo}
//                 onChange={(e) => setAgeTo(e.target.value)}
//                 aria-invalid={!!err.age}
//                 className="w-full h-11 px-4 rounded-md border border-[color:var(--input)] bg-white
//                            text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]
//                            focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--ring)]"
//                 required
//               />
//             </div>
//             {err.age && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.age}</p>}
//             <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">Allowed age range: 1–20 years old.</p>

//             {/* ---------------- Agree to Policy / Terms ---------------- */}
//             <div className="mt-5 flex items-start gap-2">
//               <input
//                 id="agree"
//                 type="checkbox"
//                 checked={agree}
//                 onChange={onAgreeToggle}  // ⬅️ ใช้ handler ใหม่ตามพฤติกรรมที่ต้องการ
//                 aria-invalid={!!err.agree}
//                 className="mt-1"
//                 required
//               />
//               <label htmlFor="agree" className="text-sm">
//                 I agree to the{" "}
//                 <button type="button" className="underline hover:opacity-80" onClick={() => setShowPolicy(true)}>
//                   Privacy Policy
//                 </button>{" "}
//                 and{" "}
//                 <button type="button" className="underline hover:opacity-80" onClick={() => setShowPolicy(true)}>
//                   Terms of Service
//                 </button>
//                 .
//               </label>
//             </div>
//             {err.agree && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.agree}</p>}

//             {/* ---------------- Submit Button ---------------- */}
//             <button
//               type="submit"
//               disabled={submitting}
//               className="mt-6 w-full h-11 rounded-md font-semibold
//                          bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
//                          hover:opacity-90 disabled:opacity-60
//                          focus:outline-none focus-visible:ring-2
//                          focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2"
//             >
//               {submitting ? "Creating..." : "Create Account"}
//             </button>

//             {/* Footer link */}
//             <div className="mt-5 text-center text-sm">
//               Already have an account?{" "}
//               <Link to="/signin" className="underline hover:opacity-90">Login</Link>
//             </div>

//             {/* Error ระดับ submit */}
//             {err.submit && (
//               <p className="mt-3 text-sm text-[color:var(--destructive)] text-center" role="alert">
//                 {err.submit}
//               </p>
//             )}
//           </form>
//         </div>

//         {/* =================== MODAL (อ่านนโยบาย) =================== */}
//         {showPolicy && (
//           <div
//             className="fixed inset-0 z-[999] flex items-center justify-center px-4"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="policy-title"
//             onClick={(e) => {
//               // คลิกฉากหลังเพื่อปิด
//               if (e.target === e.currentTarget) setShowPolicy(false);
//             }}
//           >
//             {/* ฉากหลังมืดบาง ๆ */}
//             <div className="absolute inset-0 bg-black/40" />

//             {/* กล่องเนื้อหา (โทน popover ตามธีม) */}
//             <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] shadow-lg">
//               {/* Header */}
//               <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
//                 <h2 id="policy-title" className="text-lg font-semibold">Privacy Policy & Terms of Service</h2>
//                 <button type="button" className="text-sm underline hover:opacity-80" onClick={() => setShowPolicy(false)} aria-label="Close">
//                   Close
//                 </button>
//               </div>

//               {/* Scrollable content */}
//               <div className="px-5 py-4 overflow-y-auto max-h-[65vh] text-sm leading-6">
//                 <p className="mb-3">
//                   We value your privacy and security. By creating an account and using our services, you agree to the following policy and terms.
//                 </p>

//                 <h3 className="font-semibold mt-4 mb-2">Privacy Policy</h3>
//                 <ul className="list-disc pl-5 space-y-2">
//                   <li>
//                     We collect and use your personal information (e.g., name, contact details, shipping address, and payment info) to process orders, deliver products, prevent fraud, and improve your shopping experience.
//                   </li>
//                   <li>
//                     Your data is stored securely and is never sold. We may share it with trusted third-party providers only when necessary for payment processing, delivery, analytics, or customer support—subject to appropriate safeguards.
//                   </li>
//                   <li>
//                     You may contact us to access, update, or request deletion of your personal data, subject to legal and operational requirements.
//                   </li>
//                 </ul>

//                 <h3 className="font-semibold mt-5 mb-2">Terms of Service</h3>
//                 <ul className="list-disc pl-5 space-y-2">
//                   <li>
//                     You agree to use the service lawfully and respectfully. Product availability, pricing, taxes, shipping fees, and delivery estimates are shown at checkout.
//                   </li>
//                   <li>
//                     Returns and refunds follow our return policy. We are not liable for indirect or consequential losses caused by delays, outages, or events beyond our control.
//                   </li>
//                   <li>
//                     By creating an account, you confirm that you are authorized to use the provided payment method and that all information is accurate and up to date.
//                   </li>
//                 </ul>

//                 <p className="mt-5">
//                   By selecting <strong>I agree</strong> on the sign-up form and creating an account, you acknowledge that you have read and accepted this Privacy Policy and these Terms of Service.
//                 </p>
//               </div>

//               {/* Footer */}
//               <div className="px-5 py-3 border-t border-[color:var(--border)] flex items-center justify-end gap-3">
//                 <button
//                   type="button"
//                   className="px-4 h-9 rounded-md border border-[color:var(--input)] hover:opacity-90"
//                   onClick={() => setShowPolicy(false)}
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="button"
//                   className="px-4 h-9 rounded-md font-semibold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90"
//                   onClick={confirmAgreeFromModal} // ⬅️ ยืนยันใน modal → auto-check กล่อง
//                 >
//                   I Agree
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* =================== /MODAL =================== */}
//       </div>
//     </div>
//   );
// }


// src/views/SignUp.jsx
// ✅ Flow ใหม่: สมัครสำเร็จ → แสดงแบนเนอร์ให้ไปเช็คอีเมลเพื่อ "Verify Email"
//    (ไม่ redirect ทันที; หลังจากผู้ใช้กดยืนยันจากอีเมล ค่อยให้หน้า /verify-email redirect ไป /signin อีกที)
// ✅ Named export, UI อังกฤษ, คอมเมนต์/ TODO ภาษาไทย, ใช้ตัวแปรสีจาก index.css
// ✅ ฟิลด์: Full Name, Mobile, Email, Password, Target Groups (1–20; from ≤ to)
// ✅ Checkbox + Modal: กดติ๊กครั้งแรก → เปิด modal อ่านนโยบาย → I Agree ใน modal → auto-check

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// ⛳️ (ทางเลือก) ตั้งค่าฐาน API จาก .env เมื่อเชื่อมจริง
const API_BASE = import.meta.env?.VITE_API_BASE_URL;

export function SignUp() {
  // -----------------------------
  // 📌 State ฟอร์ม
  // -----------------------------
  const [fullName, setFullName] = useState("");     // First/Last name (ช่องเดียว)
  const [mobile, setMobile] = useState("");         // Mobile number
  const [email, setEmail] = useState("");           // Email address
  const [password, setPassword] = useState("");     // Password
  const [showPw, setShowPw] = useState(false);      // toggle แสดง/ซ่อนรหัสผ่าน

  // Target Groups (ช่วงอายุ 1–20)
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");

  // Checkbox ยอมรับนโยบาย/เงื่อนไข (จะติ๊กเองหลัง user กด I Agree ใน modal)
  const [agree, setAgree] = useState(false);

  // -----------------------------
  // 📌 State สถานะ/ผลลัพธ์
  // -----------------------------
  const [submitting, setSubmitting] = useState(false); // กันกดซ้ำ
  const [successEmail, setSuccessEmail] = useState(""); // ใช้แสดงในแบนเนอร์
  const [bannerOpen, setBannerOpen] = useState(false);  // แสดงแบนเนอร์ "ไปเช็คอีเมล"

  // Error รายฟิลด์
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
  // 🧩 Modal: เปิดอ่าน Privacy & Terms (รวมไฟล์เดียว)
  // -----------------------------
  const [showPolicy, setShowPolicy] = useState(false);

  // ปิด modal ด้วยปุ่ม ESC (quality-of-life)
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowPolicy(false);
    if (showPolicy) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPolicy]);

  // -----------------------------
  // 🔎 ฟังก์ชันช่วย validate
  // -----------------------------
  const validate = () => {
    const next = { fullName: "", mobile: "", email: "", password: "", age: "", agree: "", submit: "" };

    // ชื่อ-นามสกุล
    const nameTrim = fullName.trim();
    if (!nameTrim) next.fullName = "Please enter your first and last name";

    // เบอร์มือถือ (pattern หลวม ๆ)
    const mobileTrim = mobile.trim();
    if (!mobileTrim) {
      next.mobile = "Please enter your mobile number";
    } else {
      const mobileLike = /^[0-9+\-\s]{6,20}$/;
      if (!mobileLike.test(mobileTrim)) next.mobile = "Please enter a valid mobile number";
    }

    // อีเมล
    const emailTrim = email.trim();
    if (!emailTrim) {
      next.email = "Please enter your email";
    } else {
      const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailLike.test(emailTrim)) next.email = "Please enter a valid email address";
    }

    // รหัสผ่าน (>= 6)
    if (!password) next.password = "Please enter your password";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";

    // ช่วงอายุ 1–20 และ from ≤ to
    const aFrom = Number(ageFrom);
    const aTo = Number(ageTo);
    if (!ageFrom || !ageTo) {
      next.age = "Please fill in both age fields";
    } else if (Number.isNaN(aFrom) || Number.isNaN(aTo)) {
      next.age = "Please enter a number between 1 and 20 only";
    } else if (aFrom < 1 || aFrom > 20 || aTo < 1 || aTo > 20) {
      next.age = "Please enter a number between 1 and 20 only";
    } else if (aFrom > aTo) {
      next.age = "The starting age must be less than or equal to the ending age";
    }

    // ต้องติ๊ก agree
    if (!agree) next.agree = "You must agree to the Privacy Policy and Terms of Service";

    setErr(next);
    return Object.values(next).every((v) => v === "");
  };

  // -----------------------------
  // 🧠 พฤติกรรม checkbox:
  // - ถ้าติ๊กครั้งแรก → เปิด modal (ยังไม่ setAgree)
  // - กด I Agree ใน modal → setAgree(true) + ปิด modal
  // - เอาติ๊กออก → setAgree(false)
  // -----------------------------
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
  // 📨 Submit Handler
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerOpen(false);
    setSuccessEmail("");
    setErr((o) => ({ ...o, submit: "" }));

    if (!validate()) return;

    setSubmitting(true);

    // ✅ กันแฮง: ตั้ง timeout ให้คำขอ (12 วิ)
    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 12000);

    try {
      // ✅ สร้าง payload ที่จะส่งให้ backend
      const payload = {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        password,                        // ไม่ trim เพื่อความถูกต้อง
        targetAge: { from: Number(ageFrom), to: Number(ageTo) },
        agreeToPolicy: agree,
      };

      // =======================
      // TODO: เรียก API สมัครสมาชิกจริงที่นี่
      // ตัวอย่าง fetch (ปลดคอมเมนต์เมื่อพร้อม):
      //
      // const res = await fetch(`${API_BASE}/auth/signup`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      //   signal: ac.signal,
      //   credentials: "include", // ถ้ามี cookie/CSRF
      // });
      //
      // clearTimeout(timeoutId);
      //
      // if (!res.ok) {
      //   if (res.status === 409) {
      //     setErr((o) => ({ ...o, email: "This email is already registered" }));
      //     return;
      //   }
      //   if (res.status === 422) {
      //     const { errors } = await res.json().catch(() => ({}));
      //     if (errors && typeof errors === "object") {
      //       setErr((o) => ({
      //         ...o,
      //         fullName: errors.fullName || o.fullName,
      //         mobile: errors.mobile || o.mobile,
      //         email: errors.email || o.email,
      //         password: errors.password || o.password,
      //         age: errors.targetAge || o.age,
      //         submit: errors._ || o.submit,
      //       }));
      //       return;
      //     }
      //   }
      //   const msg = await res.text().catch(() => "");
      //   setErr((o) => ({ ...o, submit: msg || "Sign up failed. Please try again." }));
      //   return;
      // }
      //
      // ✅ ถ้าสำเร็จ: backend ควร "ส่งอีเมลยืนยัน" ไปให้ผู้ใช้
      //
      // =======================
      // 🔁 MOCK ชั่วคราวระหว่างรอ backend (ลบออกเมื่อใช้ API จริง):
      await new Promise((r) => setTimeout(r, 800));
      clearTimeout(timeoutId);

      // ✅ Flow Verify Email:
      // - สมัครสำเร็จแล้ว → แจ้งผู้ใช้ให้ไปเช็คอีเมล (banner)
      // - "ไม่" redirect ตอนนี้ (รอผู้ใช้กดลิงก์ verify ในอีเมล)
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

  // -----------------------------
  // (ทางเลือก) รับพารามิเตอร์ redirect จาก query เช่น ?next=/checkout
  //   - เผื่อบาง flow ต้องจำ route ที่มาก่อน
  // -----------------------------
  const [searchParams] = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") || "", [searchParams]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[color:var(--background)] text-[color:var(--foreground)] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* ✅ Banner: แจ้งให้ไปเช็คอีเมลเพื่อยืนยันตัวตน */}
        {bannerOpen && (
          <div className="mb-4 rounded-md border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] px-4 py-3 shadow-sm">
            <div className="font-semibold">Account created</div>
            <p className="text-sm mt-1">
              We’ve sent a verification link to <strong>{successEmail}</strong>.
            </p>
            <p className="text-sm">Please check your inbox (and spam) to verify your email.</p>
            <p className="text-sm">
              After verification, you will be redirected to the Sign In page.
            </p>
            {/* TODO: (ถ้าต้องการ) ปุ่มขอส่งลิงก์ใหม่ */}
            {/* <button className="mt-2 text-sm underline hover:opacity-80">Resend verification email</button> */}
            <button
              type="button"
              className="mt-2 text-sm underline hover:opacity-80"
              onClick={() => setBannerOpen(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 🔲 การ์ดแบบฟอร์ม */}
        <div className="border border-[color:var(--border)] rounded-[var(--radius)] bg-[color:var(--card)] shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Create an account</h1>

            {/* ---------------- Full Name ---------------- */}
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">First Name / Last Name</label>
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
            {err.fullName && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.fullName}</p>}

            {/* ---------------- Mobile Number ---------------- */}
            <label htmlFor="mobile" className="block text-sm font-medium mt-5 mb-2">Mobile number</label>
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
            {err.mobile && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.mobile}</p>}

            {/* ---------------- Email Address ---------------- */}
            <label htmlFor="email" className="block text-sm font-medium mt-5 mb-2">Email address</label>
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
            {err.email && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.email}</p>}

            {/* ---------------- Password ---------------- */}
            <label htmlFor="password" className="block text-sm font-medium mt-5 mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                name="new-password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
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
            {err.password && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.password}</p>}

            {/* ---------------- Target Groups (Age range 1–20) ---------------- */}
            <label className="block text-sm font-medium mt-5 mb-2">Target Groups (Age range)</label>
            <div className="flex items-center gap-2">
              <input
                id="ageFrom"
                name="age-from"
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
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
                min={1}
                max={20}
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
            {err.age && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.age}</p>}
            <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">Allowed age range: 1–20 years old.</p>

            {/* ---------------- Agree to Policy / Terms ---------------- */}
            <div className="mt-5 flex items-start gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={onAgreeToggle}  // ⬅️ พฤติกรรม: เปิด modal เมื่อกดติ๊กครั้งแรก
                aria-invalid={!!err.agree}
                className="mt-1"
                required
              />
              <label htmlFor="agree" className="text-sm">
                I agree to the{" "}
                <button type="button" className="underline hover:opacity-80" onClick={() => setShowPolicy(true)}>
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button type="button" className="underline hover:opacity-80" onClick={() => setShowPolicy(true)}>
                  Terms of Service
                </button>
                .
              </label>
            </div>
            {err.agree && <p className="mt-1 text-sm text-[color:var(--destructive)]" role="alert">{err.agree}</p>}

            {/* (อธิบาย flow ให้ผู้ใช้เข้าใจล่วงหน้า) */}
            <p className="mt-3 text-xs text-[color:var(--muted-foreground)]">
              After creating an account, we will send a verification link to your email. Please verify before signing in.
            </p>

            {/* ---------------- Submit Button ---------------- */}
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
              <Link to="/signin" className="underline hover:opacity-90">Login</Link>
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
              // คลิกฉากหลังเพื่อปิด
              if (e.target === e.currentTarget) setShowPolicy(false);
            }}
          >
            {/* ฉากหลังมืดบาง ๆ */}
            <div className="absolute inset-0 bg-black/40" />

            {/* กล่องเนื้อหา (โทน popover ตามธีม) */}
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--popover)] text-[color:var(--popover-foreground)] shadow-lg">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
                <h2 id="policy-title" className="text-lg font-semibold">Privacy Policy & Terms of Service</h2>
                <button type="button" className="text-sm underline hover:opacity-80" onClick={() => setShowPolicy(false)} aria-label="Close">
                  Close
                </button>
              </div>

              {/* Scrollable content */}
              <div className="px-5 py-4 overflow-y-auto max-h-[65vh] text-sm leading-6">
                <p className="mb-3">
                  We value your privacy and security. By creating an account and using our services, you agree to the following policy and terms.
                </p>

                <h3 className="font-semibold mt-4 mb-2">Privacy Policy</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    We collect and use your personal information (e.g., name, contact details, shipping address, and payment info) to process orders, deliver products, prevent fraud, and improve your shopping experience.
                  </li>
                  <li>
                    Your data is stored securely and is never sold. We may share it with trusted third-party providers only when necessary for payment processing, delivery, analytics, or customer support—subject to appropriate safeguards.
                  </li>
                  <li>
                    You may contact us to access, update, or request deletion of your personal data, subject to legal and operational requirements.
                  </li>
                </ul>

                <h3 className="font-semibold mt-5 mb-2">Terms of Service</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    You agree to use the service lawfully and respectfully. Product availability, pricing, taxes, shipping fees, and delivery estimates are shown at checkout.
                  </li>
                  <li>
                    Returns and refunds follow our return policy. We are not liable for indirect or consequential losses caused by delays, outages, or events beyond our control.
                  </li>
                  <li>
                    By creating an account, you confirm that you are authorized to use the provided payment method and that all information is accurate and up to date.
                  </li>
                </ul>

                <p className="mt-5">
                  By selecting <strong>I agree</strong> on the sign-up form and creating an account, you acknowledge that you have read and accepted this Privacy Policy and these Terms of Service.
                </p>
              </div>

              {/* Footer */}
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
                  onClick={confirmAgreeFromModal} // ⬅️ ยืนยันใน modal → auto-check กล่อง
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
