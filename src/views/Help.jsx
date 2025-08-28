// src/views/Help.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                      */
/* -------------------------------------------------------------------------- */

// FAQ แบ่งหมวดเพื่อแก้ง่าย (มี id ของหมวดและ id ของคำถามสำหรับคีย์ที่คงที่)
const FAQ_SECTIONS = [
  {
    id: "account",
    title: "Account",
    items: [
      {
        id: "create",
        q: "How do I create an account?",
        a: "Click “Sign Up” at the top right, fill in your details (name, email, password, target age range), then confirm the verification email before signing in.",
      },
      {
        id: "signin",
        q: "I can’t sign in. What should I do?",
        a: "Ensure your email is verified and your password has at least 6 characters. If it still fails, try the Forgot password option.",
      },
      {
        id: "reset",
        q: "How do I reset my password?",
        a: "Go to the Forgot password page, enter your email, and check your inbox (and spam) for the reset link.",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & Payments",
    items: [
      {
        id: "methods",
        q: "Which payment methods are supported?",
        a: "We accept major debit/credit cards and other electronic methods (availability may vary by region).",
      },
      {
        id: "summary",
        q: "Where can I find my order summary and receipt?",
        a: "After checkout, you’ll see the confirmation page with your order number. You can also review your order history in your account.",
      },
      {
        id: "cart",
        q: "Can I change items before paying?",
        a: "Yes. Use the Cart page to update quantities or remove items before you proceed to checkout.",
      },
    ],
  },
  {
    id: "downloads",
    title: "Digital Downloads",
    items: [
      {
        id: "when",
        q: "When do I receive my download link?",
        a: "Once payment is successful, we email you a secure link. You can also find downloads in your order details later.",
      },
      {
        id: "issue",
        q: "The download link doesn’t work. What can I try?",
        a: "Sign in with the same account used for purchase. Try another browser or clear your cache. If the issue persists, contact support.",
      },
      {
        id: "share",
        q: "Can I share my downloaded files?",
        a: "Downloads are licensed for personal use only. Redistribution or commercial use isn’t permitted unless explicitly stated.",
      },
    ],
  },
  {
    id: "refunds",
    title: "Cancellations & Refunds",
    items: [
      {
        id: "cancel",
        q: "Can I cancel an order?",
        a: "Orders can be canceled before payment is captured. After payment, cancellation may not be possible for instant digital delivery.",
      },
      {
        id: "refund",
        q: "Do you offer refunds for digital products?",
        a: "Delivered digital items are generally non-refundable. If there’s an access/file issue, contact support for a case-by-case review.",
      },
      {
        id: "duration",
        q: "How long does a refund take (if approved)?",
        a: "Refund times depend on your payment method and bank—typically 5–10 business days after approval.",
      },
    ],
  },
];

// Policy สรุปจากข้อความใน SignUp เพื่อให้สอดคล้องทั้งระบบ
const PRIVACY_SUMMARY = [
  "We collect and use personal information (e.g., name, contact details, address, and payment info) to process orders, deliver products, prevent fraud, and improve your experience.",
  "Your data is stored securely and is never sold. We may share it with trusted third-party providers only when necessary for payment, delivery, analytics, or customer support with appropriate safeguards.",
  "You may contact us to access, update, or request deletion of your personal data, subject to legal and operational requirements.",
];

const TERMS_SUMMARY = [
  "Use the service lawfully and respectfully. Product availability, pricing, taxes, fees, and delivery estimates are shown at checkout.",
  "Returns and refunds follow our return policy. We’re not liable for indirect or consequential losses caused by delays, outages, or events beyond our control.",
  "By creating an account, you confirm you’re authorized to use the provided payment method and that your information is accurate and up to date.",
  "By selecting “I agree” during sign-up, you accept our Privacy Policy and Terms of Service.",
];

/* -------------------------------------------------------------------------- */
/*                               UI COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

// Accordion ของแต่ละคำถาม
// - pointer + hover เพื่อสื่อว่าคลิกได้
// - ไอคอน "+" หมุน 45° เมื่อเปิด (กลายเป็นเครื่องหมาย ×)
function AccordionItem({ item, idx, open, onToggle }) {
  return (
    <div className="border border-[color:var(--border)] rounded-[calc(var(--radius)-2px)] bg-[color:var(--card)]">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-item-${idx}`}
        className="
          w-full px-4 py-3 md:px-5 md:py-4
          flex items-center justify-between
          font-semibold text-left
          cursor-pointer transition-colors
          hover:bg-[color:var(--card)]/60
          rounded-[calc(var(--radius)-2px)]
        "
      >
        <span className="pr-4">{item.q}</span>
        <span
          className={`ml-4 text-xl leading-none transform transition-transform ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>

      {open && (
        <div
          id={`faq-item-${idx}`}
          className="px-4 pb-4 md:px-5 md:pb-5 text-sm leading-6 text-[color:var(--foreground)]/90 border-t border-[color:var(--border)]"
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

// หมวด FAQ หนึ่งหมวด
function FaqSection({ section, openMap, setOpenMap }) {
  return (
    <section id={`faq-${section.id}`} className="scroll-mt-24">
      <h3 className="text-xl md:text-2xl font-bold mb-3">{section.title}</h3>
      <div className="grid gap-3 md:gap-4">
        {section.items.map((it) => {
          const key = `${section.id}:${it.id}`; // คีย์ถาวรของแต่ละคำถาม
          const isOpen = !!openMap[key];
          return (
            <AccordionItem
              key={key}
              item={it}
              idx={key}
              open={isOpen}
              onToggle={() =>
                setOpenMap((prev) => ({ ...prev, [key]: !isOpen }))
              }
            />
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN VIEW                                   */
/* -------------------------------------------------------------------------- */

export function Help() {
  // เก็บสถานะเปิด/ปิดของคำถามในรูปแบบ map: { "sectionId:itemId": boolean }
  const [openMap, setOpenMap] = useState({});

  // รองรับการเข้ามาพร้อม hash (เช่น /help#faq-orders)
  const { hash } = useLocation();
  const targetId = useMemo(() => (hash ? hash.replace("#", "") : ""), [hash]);

  // เมื่อ hash เปลี่ยน:
  // 1) เลื่อนไปยัง element เป้าหมาย
  // 2) หากเป็น #faq-<section> ให้เปิดคำถามข้อแรกของหมวดนั้น
  useEffect(() => {
    if (!targetId) return;

    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

    if (targetId.startsWith("faq-")) {
      const sectionId = targetId.replace("faq-", "");
      const sec = FAQ_SECTIONS.find((s) => s.id === sectionId);
      if (sec && sec.items.length) {
        const firstKey = `${sec.id}:${sec.items[0].id}`;
        setOpenMap((prev) => ({ ...prev, [firstKey]: true }));
      }
    }
  }, [targetId]);

  return (
    <div className="bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* ------------------------------- HERO -------------------------------- */}
      <section id="help-top" className="layout mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-10 scroll-mt-24">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Help & Support
        </h1>
        <p className="mt-3 md:mt-4 text-[color:var(--foreground)]/70 max-w-2xl">
          Find quick answers, manage your account, or contact our team. Use the
          quick links below or browse FAQs.
        </p>
      </section>

      {/* ---------------------------- QUICK LINKS ---------------------------- */}
      <section className="layout mx-auto px-4 pb-6 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[
            {
              title: "Account",
              href: "#faq-account",
              desc: "Create account, sign in, reset password",
            },
            {
              title: "Orders & Payments",
              href: "#faq-orders",
              desc: "Placing orders, methods, receipts",
            },
            {
              title: "Digital Downloads",
              href: "#faq-downloads",
              desc: "Access purchased files",
            },
            {
              title: "Cancellations & Refunds",
              href: "#faq-refunds",
              desc: "Cancel orders, refund policy & timing",
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="
                w-full h-full
                rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)]
                p-6 hover:shadow-sm
                text-center flex flex-col items-center justify-center min-h-[120px]
              "
              aria-label={`${card.title} — ${card.desc}`}
            >
              <div className="text-lg font-bold">{card.title}</div>
              <div className="text-sm opacity-80 mt-1">{card.desc}</div>
            </a>
          ))}
        </div>
      </section>

      {/* -------------------------------- FAQ -------------------------------- */}
      {/* จำกัดความกว้างเพื่อให้อ่านสบายสายตา (ไม่เต็มจอ) และจัดกลาง */}
      <section id="faq" className="layout mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl md:max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {FAQ_SECTIONS.map((sec) => (
              <FaqSection
                key={sec.id}
                section={sec}
                openMap={openMap}
                setOpenMap={setOpenMap}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ POLICIES ----------------------------- */}
      <section id="policies" className="layout mx-auto px-4 pb-8 md:pb-12">
        {/* Privacy */}
        <div id="privacy" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold">
            Privacy Policy (Summary)
          </h2>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-sm leading-6">
            {PRIVACY_SUMMARY.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Terms */}
        <div id="terms" className="scroll-mt-24 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Terms of Service (Summary)
          </h2>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-sm leading-6">
            {TERMS_SUMMARY.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------ CONTACT ------------------------------ */}
      <section id="contact" className="layout mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Message */}
          <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-center">
            <div className="text-3xl mb-2" aria-hidden>
              💬
            </div>
            <div className="font-semibold">Message Hours</div>
            <div className="text-sm opacity-80 mt-1">Mon–Sat, 9:00–18:00</div>
          </div>

          {/* Phone */}
          <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-center">
            <div className="text-3xl mb-2" aria-hidden>
              📱
            </div>
            <div className="font-semibold">Phone</div>
            <div className="text-sm opacity-80 mt-1">+66 001-800-65-6453</div>
            <div className="text-xs opacity-60">Mon–Sat, 9:00–18:00</div>
          </div>

          {/* Store */}
          <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-center">
            <div className="text-3xl mb-2" aria-hidden>
              📍
            </div>
            <div className="font-semibold">Find a Store</div>
            <div className="text-sm opacity-80 mt-1">Generation, Thailand</div>

            <div className="mt-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Generation%20Thailand"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 h-10 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
