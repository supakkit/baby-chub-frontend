// src/views/UserProfile.jsx
// Professional user profile page
// - Keep ALL original sections (Profile, Address, Payments, Preferences, Notifications, Security, etc.)
// - Adjust ONLY two parts as requested:
//   (1) Orders => "Your purchase history" with single "View order" button (no downloads here)
//   (2) Active sessions => Simple, grouped by device (OS · Browser), single "Sign out on this device" (no modal/password)

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { getMySessions, revokeSession } from "../services/userServices";

// ----------------------------- Utils -----------------------------
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}
function maskEmail(email = "") {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const masked =
    name.length <= 2
      ? name[0] + "*"
      : name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  return `${masked}@${domain}`;
}
function brandFromCard(number = "") {
  const n = (number || "").replace(/\s+/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^(6011|65)/.test(n)) return "Discover";
  return "Card";
}
async function fileToDataURL(file) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
// ----------------------------- Money (THB) -----------------------------
const thb = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
function money(n) {
  const v = Number(n ?? 0);
  return thb.format(v); // ฿1,234.00
}

// --------------------------- Component ---------------------------
export function UserProfile() {
  const {
    user,
    updateProfile,
    updatePreferences,
    toggleNewsletter,
    changePassword,
    deleteAccount,
    logout,
  } = useUser();

  // Normalize user for safe access (keep everything else intact)
  const safeUser = {
    ...user,
    avatarUrl: user?.avatarUrl || "",
    phone: user?.phone || "",
    address: {
      line1: user?.address?.line1 || "",
      line2: user?.address?.line2 || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "",
    },
    paymentMethods: Array.isArray(user?.paymentMethods)
      ? user.paymentMethods
      : [],
    preferences: {
      ageRange: user?.preferences?.ageRange || "",
      interests: user?.preferences?.interests || [],
    },
    notifications: {
      orderUpdates: user?.notifications?.orderUpdates ?? true,
      productTips: user?.notifications?.productTips ?? false,
      promotions: user?.notifications?.promotions ?? false,
    },
    orders: Array.isArray(user?.orders) ? user.orders : [],
  };

  // ===================== Orders / cards =====================
  const orders = safeUser.orders;
  const savedCards = safeUser.paymentMethods;

  // ===================== Sessions (grouped & filtered) =====================
  const [sessions, setSessions] = useState([]);
  const [sessionGroups, setSessionGroups] = useState({
    desktop: [],
    mobile: [],
  });
  const [revoking, setRevoking] = useState(false);

  function isMobileUA(ua = "") {
    return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua);
  }
  function parseUA(ua = "") {
    const browser = /Edg\//.test(ua)
      ? "Edge"
      : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
      ? "Firefox"
      : /Chrome\//.test(ua)
      ? "Chrome"
      : /Safari\//.test(ua)
      ? "Safari"
      : "Unknown";
    const os = /Windows NT/.test(ua)
      ? "Windows"
      : /Macintosh/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
      ? "Android"
      : /(iPhone|iPad|iPod)/.test(ua)
      ? "iOS/iPadOS"
      : "Unknown";
    return { browser, os, type: isMobileUA(ua) ? "mobile" : "desktop" };
  }
  function groupSessions(list = []) {
    // Group by "type|os|browser" so repeated logins on the same device show as one card
    const map = new Map();
    list.forEach((s) => {
      const ua = s?.userAgent || s?.ua || s?.device || "";
      const meta = parseUA(ua);
      const key = `${meta.type}|${meta.os}|${meta.browser}`;
      const lastActive = s?.lastActive ? new Date(s.lastActive).getTime() : 0;

      const item = map.get(key) || {
        key,
        type: meta.type,
        os: meta.os,
        browser: meta.browser,
        label: `${meta.os} · ${meta.browser}`,
        lastActive: 0,
        ip: "",
        sessions: [],
      };
      item.sessions.push(s);
      if (lastActive >= item.lastActive) {
        item.lastActive = lastActive;
        item.ip = s?.ip || "";
      }
      map.set(key, item);
    });

    const groups = Array.from(map.values())
      .map((g) => ({ ...g, count: g.sessions.length }))
      .sort((a, b) => b.lastActive - a.lastActive);

    return {
      desktop: groups.filter((g) => g.type === "desktop"),
      mobile: groups.filter((g) => g.type === "mobile"),
    };
  }

  async function loadSessions() {
    try {
      const list = await getMySessions();
      // Safety: show only the currently signed-in user's sessions
      const filtered = (Array.isArray(list) ? list : []).filter(
        (s) => !s?.email || s.email === user?.email
      );
      setSessions(filtered);
      setSessionGroups(groupSessions(filtered));
    } catch (_) {
      setSessions([]);
      setSessionGroups({ desktop: [], mobile: [] });
    }
  }
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simple revoke: confirm -> revoke each session id in that device group -> reload
  function handleRevoke(sessionIdOrIds) {
    const ids = Array.isArray(sessionIdOrIds)
      ? sessionIdOrIds
      : [sessionIdOrIds];
    if (
      !window.confirm(
        `Sign out from ${ids.length} session${ids.length > 1 ? "s" : ""}?`
      )
    )
      return;

    setRevoking(true);
    (async () => {
      try {
        for (const raw of ids) {
          const sid = raw?._id || raw?.id || raw;
          if (sid) await revokeSession(sid);
        }
        toast.success(
          ids.length > 1 ? "Signed out on that device" : "Signed out"
        );
        await loadSessions();
      } catch (err) {
        toast.error(err?.message || "Failed to sign out");
      } finally {
        setRevoking(false);
      }
    })();
  }

  // ===================== Profile states (keep original parts) =====================
  const [avatarPreview, setAvatarPreview] = useState(safeUser.avatarUrl);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(safeUser.phone);
  const [phoneError, setPhoneError] = useState("");

  const [addr, setAddr] = useState(safeUser.address);

  const [cardForm, setCardForm] = useState({
    holder: "",
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });
  const [cardErrors, setCardErrors] = useState({
    holder: "",
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const [ageRange, setAgeRange] = useState(safeUser.preferences.ageRange);
  const [interests, setInterests] = useState(safeUser.preferences.interests);
  const [notif, setNotif] = useState(safeUser.notifications);
  const [newsletter, setNewsletter] = useState(!!user?.newsletter);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);

  const btnProfileRef = useRef(null);
  const btnAddressRef = useRef(null);
  const btnPrefsRef = useRef(null);
  const btnNotifRef = useRef(null);
  const btnAddCardRef = useRef(null);
  const btnChangePwRef = useRef(null);
  const btnRemovePhotoRef = useRef(null);

  const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const onlyDigits = (s = "") => s.replace(/\D+/g, "");
  function validatePhone(p = "") {
    const d = onlyDigits(p);
    if (d.length === 0) return "";
    if (d.length < 8) return "Phone number seems too short.";
    return "";
  }
  function validateCardFields(cf) {
    const errs = { holder: "", number: "", expMonth: "", expYear: "", cvc: "" };
    if (!cf.holder.trim()) errs.holder = "Name on card is required.";
    const num = onlyDigits(cf.number);
    if (num.length < 12 || num.length > 19)
      errs.number = "Card number must be 12–19 digits.";
    if (!/^\d{2}$/.test(cf.expMonth)) errs.expMonth = "Use 2-digit month (MM).";
    else {
      const m = Number(cf.expMonth);
      if (m < 1 || m > 12) errs.expMonth = "Month must be 01–12.";
    }
    if (!/^\d{2,4}$/.test(cf.expYear))
      errs.expYear = "Use 2 or 4-digit year (YY or YYYY).";
    if (!/^\d{3,4}$/.test(cf.cvc)) errs.cvc = "CVC must be 3–4 digits.";
    return errs;
  }
  const hasAnyError = (obj) => Object.values(obj).some(Boolean);

  async function onAvatarSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) {
      toast.error("Please select an image file (png, jpg, webp).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }
    const dataURL = await fileToDataURL(file);
    setAvatarPreview(dataURL);
    setAvatarFileName(file.name);
  }
  async function handleRemovePhoto() {
    setRemovingPhoto(true);
    try {
      await updateProfile({ avatarUrl: "" });
      setAvatarPreview("");
      setAvatarFileName("");
      toast.success("Profile photo removed");
      btnRemovePhotoRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to remove photo");
    } finally {
      setRemovingPhoto(false);
    }
  }
  async function handleSaveProfile(e) {
    e.preventDefault();
    const pErr = validatePhone(phone);
    setPhoneError(pErr);
    if (pErr) return;

    setSavingProfile(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        avatarUrl: avatarPreview || "",
      });
      toast.success("Profile updated");
      btnProfileRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }
  async function handleSaveAddress(e) {
    e.preventDefault();
    setSavingAddress(true);
    try {
      await updateProfile({
        address: {
          line1: addr.line1.trim(),
          line2: addr.line2.trim(),
          city: addr.city.trim(),
          state: addr.state.trim(),
          postalCode: addr.postalCode.trim(),
          country: addr.country.trim(),
        },
      });
      toast.success("Billing address saved");
      btnAddressRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  }
  async function handleAddCard(e) {
    e.preventDefault();
    const errs = validateCardFields(cardForm);
    setCardErrors(errs);
    if (hasAnyError(errs)) return;

    const num = onlyDigits(cardForm.number);
    setAddingCard(true);
    try {
      const meta = {
        brand: brandFromCard(num),
        last4: num.slice(-4),
        holder: cardForm.holder.trim(),
        expMonth: cardForm.expMonth,
        expYear:
          cardForm.expYear.length === 2
            ? `20${cardForm.expYear}`
            : cardForm.expYear,
        addedAt: new Date().toISOString(),
      };
      const next = [...savedCards, meta];
      await updateProfile({ paymentMethods: next });
      setCardForm({
        holder: "",
        number: "",
        expMonth: "",
        expYear: "",
        cvc: "",
      });
      setCardErrors({
        holder: "",
        number: "",
        expMonth: "",
        expYear: "",
        cvc: "",
      });
      toast.success("Payment method added");
      btnAddCardRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to add card");
    } finally {
      setAddingCard(false);
    }
  }
  async function handleRemoveCard(i) {
    const next = savedCards.filter((_, idx) => idx !== i);
    await updateProfile({ paymentMethods: next });
    toast.success("Payment method removed");
  }

  async function handleSavePrefs(e) {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      await updatePreferences({ ageRange, interests });
      toast.success("Preferences saved");
      btnPrefsRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to save preferences");
    } finally {
      setSavingPrefs(false);
    }
  }
  async function handleSaveNotif(e) {
    e.preventDefault();
    setSavingNotif(true);
    try {
      await updateProfile({ notifications: notif });
      await toggleNewsletter(!!newsletter);
      toast.success("Notification settings updated");
      btnNotifRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to update notifications");
    } finally {
      setSavingNotif(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPw.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setChangingPw(true);
    try {
      await changePassword(currentPw, newPw);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Password changed");
      btnChangePwRef.current?.focus();
    } catch (err) {
      toast.error(err?.message || "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  }

  async function handleExportData() {
    toast.success("We’ll email you a copy of your data.");
  }
  const [confirmText, setConfirmText] = useState("");
  const confirmOk = confirmText === "DELETE";
  async function handleDeleteAccount() {
    if (!confirmOk) {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }
    await deleteAccount();
    toast.success("Account deleted");
  }

  // ----------------------------- UI -----------------------------
  return (
    <section className="layout mx-auto px-4 pt-8 pb-14 md:pt-10 md:pb-18">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          My Account
        </h1>
        <div className="text-sm text-[color:var(--muted-foreground)]">
          Signed in as{" "}
          <span className="font-medium">{maskEmail(user?.email)}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ------------ Left (content) ------------ */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Basic info that identifies your account.
            </p>

            <form
              onSubmit={handleSaveProfile}
              className="mt-5 space-y-5"
              aria-live="polite"
              aria-busy={savingProfile}
            >
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <img
                  src={avatarPreview || "/images/person.svg"}
                  alt="Profile photo"
                  className="w-16 h-16 rounded-full border border-[color:var(--border)] object-cover bg-white"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile photo
                  </label>

                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={onAvatarSelect}
                    className="sr-only"
                    disabled={savingProfile}
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="avatar"
                      className={cn(
                        "inline-flex items-center justify-center h-10 px-4 rounded-md border border-[color:var(--border)] bg-white hover:bg-[color:var(--muted)]/40 cursor-pointer",
                        savingProfile && "opacity-60 cursor-not-allowed"
                      )}
                      aria-disabled={savingProfile}
                    >
                      Choose file
                    </label>
                    <button
                      type="button"
                      ref={btnRemovePhotoRef}
                      onClick={handleRemovePhoto}
                      disabled={removingPhoto || savingProfile}
                      className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-[color:var(--border)] hover:bg-[color:var(--muted)]/40"
                      title="Remove current photo"
                    >
                      {removingPhoto ? "Removing..." : "Remove photo"}
                    </button>
                  </div>

                  <div className="text-sm mt-2">
                    {avatarFileName || "No file chosen"}
                  </div>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                    PNG, JPG, or WEBP. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-1">
                    First name
                  </label>
                  <input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                    disabled={savingProfile}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm mb-1">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                    disabled={savingProfile}
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-1">
                    Email (read-only)
                  </label>
                  <input
                    id="email"
                    value={email}
                    readOnly
                    className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-[color:var(--muted)]/40 text-[color:var(--muted-foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? "err-phone" : undefined}
                    className={cn(
                      "w-full h-10 px-3 rounded-md border bg-white",
                      phoneError
                        ? "border-red-500"
                        : "border-[color:var(--input)]"
                    )}
                    disabled={savingProfile}
                  />
                  {phoneError && (
                    <p
                      id="err-phone"
                      className="mt-1 text-xs text-red-600"
                      role="alert"
                    >
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                ref={btnProfileRef}
                disabled={savingProfile}
                className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90 disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          {/* Billing Address */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Billing Address</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Used for invoices and payment verification.
            </p>

            <form
              onSubmit={handleSaveAddress}
              className="mt-5 space-y-4"
              aria-live="polite"
              aria-busy={savingAddress}
            >
              <div>
                <label htmlFor="line1" className="block text-sm mb-1">
                  Address line 1
                </label>
                <input
                  id="line1"
                  value={addr.line1}
                  onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  disabled={savingAddress}
                />
              </div>
              <div>
                <label htmlFor="line2" className="block text-sm mb-1">
                  Address line 2 (optional)
                </label>
                <input
                  id="line2"
                  value={addr.line2}
                  onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  disabled={savingAddress}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    value={addr.city}
                    onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                    disabled={savingAddress}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm mb-1">
                    State/Province
                  </label>
                  <input
                    id="state"
                    value={addr.state}
                    onChange={(e) =>
                      setAddr({ ...addr, state: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                    disabled={savingAddress}
                  />
                </div>
                <div>
                  <label htmlFor="postal" className="block text-sm mb-1">
                    Postal code
                  </label>
                  <input
                    id="postal"
                    value={addr.postalCode}
                    onChange={(e) =>
                      setAddr({ ...addr, postalCode: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                    disabled={savingAddress}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm mb-1">
                  Country
                </label>
                <input
                  id="country"
                  value={addr.country}
                  onChange={(e) =>
                    setAddr({ ...addr, country: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  disabled={savingAddress}
                />
              </div>

              <button
                type="submit"
                ref={btnAddressRef}
                disabled={savingAddress}
                className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90 disabled:opacity-60"
              >
                {savingAddress ? "Saving..." : "Save address"}
              </button>
            </form>
          </section>

          {/* Orders (MODIFIED) */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your purchase history</h2>
                <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                  View your orders and details.
                </p>
              </div>
              <Link
                to="/products"
                className="text-sm underline hover:opacity-90"
                title="Browse more"
              >
                Browse products
              </Link>
            </div>

            {/* Desktop table */}
            <div className="mt-5 hidden md:block overflow-auto">
              {orders.length === 0 ? (
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  No orders yet.
                </div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b border-[color:var(--border)]">
                      <th className="py-2 pr-3">Order #</th>
                      <th className="py-2 pr-3">Date</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Total</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-[color:var(--border)]"
                      >
                        <td className="py-3 pr-3 font-medium">{o.id}</td>
                        <td className="py-3 pr-3">
                          {o?.date ? new Date(o.date).toLocaleString() : "-"}
                        </td>
                        <td className="py-3 pr-3">{o?.status || "-"}</td>
                        <td className="py-3 pr-3">
                          {typeof o?.total === "number"
                            ? `${money(o.total)}`
                            : "-"}
                        </td>
                        <td className="py-3">
                          <Link
                            to={`/orders/${o.id}`}
                            className="h-9 px-3 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40"
                            title="View order"
                          >
                            View order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile cards */}
            <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-[var(--radius)] border border-[color:var(--border)] bg-white p-4"
                >
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="text-sm text-[color:var(--muted-foreground)]">
                    {(o?.date && new Date(o.date).toLocaleString()) || "-"} ·{" "}
                    {o?.status || "-"} ·{" "}
                    {typeof o?.total === "number"
                      ? `$${o.total.toFixed(2)}`
                      : "-"}
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/orders/${o.id}`}
                      className="h-9 px-3 inline-flex items-center justify-center rounded-md border hover:bg-[color:var(--muted)]/40"
                      title="View order"
                    >
                      View order
                    </Link>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-[color:var(--muted-foreground)]">
                  No orders yet.
                </div>
              )}
            </div>
          </section>

          {/* Security (Change password + Active sessions) */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Change your password and review active devices.
            </p>

            <form
              onSubmit={handleChangePassword}
              className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"
              aria-busy={changingPw}
            >
              <div>
                <label htmlFor="current" className="block text-sm mb-1">
                  Current password
                </label>
                <input
                  id="current"
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  required
                  disabled={changingPw}
                />
              </div>
              <div>
                <label htmlFor="newPw" className="block text-sm mb-1">
                  New password
                </label>
                <input
                  id="newPw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  placeholder="Min 8 characters"
                  minLength={8}
                  required
                  disabled={changingPw}
                />
              </div>
              <div>
                <label htmlFor="confirmPw" className="block text-sm mb-1">
                  Confirm new password
                </label>
                <input
                  id="confirmPw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  minLength={8}
                  required
                  disabled={changingPw}
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  ref={btnChangePwRef}
                  disabled={changingPw}
                  className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90 disabled:opacity-60"
                >
                  {changingPw ? "Changing..." : "Change password"}
                </button>
              </div>
            </form>

            {/* Active sessions (MODIFIED: grouped & simple) */}
            <div className="mt-6">
              <h3 className="font-medium">Active sessions</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                You're signed in on these devices. Choose where to sign out.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3">
                {[...sessionGroups.desktop, ...sessionGroups.mobile].map(
                  (g) => (
                    <div
                      key={g.key}
                      className="flex items-center justify-between rounded-md border border-[color:var(--border)] bg-white px-4 py-3 text-sm"
                    >
                      <div>
                        <div className="font-medium">{g.label}</div>
                        <div className="text-[color:var(--muted-foreground)]">
                          {g.count} session{g.count > 1 ? "s" : ""} · last
                          active{" "}
                          {g.lastActive
                            ? new Date(g.lastActive).toLocaleString()
                            : "—"}
                          {g.ip ? ` · IP ${g.ip}` : ""}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleRevoke(
                            g.sessions
                              .map((s) => s?._id || s?.id)
                              .filter(Boolean)
                          )
                        }
                        disabled={revoking || g.sessions.length === 0}
                        className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-[color:var(--border)] hover:bg-[color:var(--muted)]/50 disabled:opacity-60"
                        title="Sign out on this device"
                      >
                        {revoking ? "Working..." : "Sign out on this device"}
                      </button>
                    </div>
                  )
                )}

                {sessionGroups.desktop.length + sessionGroups.mobile.length ===
                  0 && (
                  <div className="text-sm text-[color:var(--muted-foreground)]">
                    No active devices.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ------------ Right (sidebar) ------------ */}
        <aside className="md:col-span-1 space-y-8">
          {/* Notifications */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Choose what you want to hear from us.
            </p>

            <form
              onSubmit={handleSaveNotif}
              className="mt-5 space-y-3"
              aria-busy={savingNotif}
            >
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={notif.orderUpdates}
                  onChange={(e) =>
                    setNotif({ ...notif, orderUpdates: e.target.checked })
                  }
                  disabled={savingNotif}
                />
                Order status updates
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={notif.productTips}
                  onChange={(e) =>
                    setNotif({ ...notif, productTips: e.target.checked })
                  }
                  disabled={savingNotif}
                />
                Product tips & recommendations
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={notif.promotions}
                  onChange={(e) =>
                    setNotif({ ...notif, promotions: e.target.checked })
                  }
                  disabled={savingNotif}
                />
                Promotions & offers
              </label>

              <div className="pt-2">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    disabled={savingNotif}
                  />
                  Receive newsletter
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  ref={btnNotifRef}
                  disabled={savingNotif}
                  className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90 disabled:opacity-60"
                >
                  {savingNotif ? "Saving..." : "Save preferences"}
                </button>
              </div>
            </form>
          </section>

          {/* Payment methods */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Payment methods</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Add a new card or remove an existing one.
            </p>

            {/* Saved cards */}
            <div className="mt-4 space-y-2">
              {savedCards.length === 0 ? (
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  No payment methods yet.
                </div>
              ) : (
                savedCards.map((c, i) => (
                  <div
                    key={`${c.brand}-${c.last4}-${i}`}
                    className="flex items-center justify-between rounded-md border border-[color:var(--border)] bg-white px-3 py-2"
                  >
                    <div className="text-sm">
                      <div className="font-medium">
                        {c.brand || "Card"} ·•••• {c.last4}
                      </div>
                      <div className="text-[color:var(--muted-foreground)]">
                        Holder {c.holder || "-"} · exp {c.expMonth}/{c.expYear}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(i)}
                      className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-[color:var(--border)] hover:bg-[color:var(--muted)]/40"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add card form */}
            <form
              onSubmit={handleAddCard}
              className="mt-4 space-y-3"
              aria-busy={addingCard}
            >
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm mb-1">Name on card</label>
                  <input
                    value={cardForm.holder}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, holder: e.target.value })
                    }
                    className={cn(
                      "w-full h-10 px-3 rounded-md border bg-white",
                      cardErrors.holder
                        ? "border-red-500"
                        : "border-[color:var(--input)]"
                    )}
                    aria-invalid={!!cardErrors.holder}
                  />
                  {cardErrors.holder && (
                    <p className="text-xs text-red-600 mt-1">
                      {cardErrors.holder}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1">Card number</label>
                  <input
                    value={cardForm.number}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, number: e.target.value })
                    }
                    className={cn(
                      "w-full h-10 px-3 rounded-md border bg-white",
                      cardErrors.number
                        ? "border-red-500"
                        : "border-[color:var(--input)]"
                    )}
                    aria-invalid={!!cardErrors.number}
                    inputMode="numeric"
                  />
                  {cardErrors.number && (
                    <p className="text-xs text-red-600 mt-1">
                      {cardErrors.number}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm mb-1">MM</label>
                    <input
                      value={cardForm.expMonth}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, expMonth: e.target.value })
                      }
                      className={cn(
                        "w-full h-10 px-3 rounded-md border bg-white",
                        cardErrors.expMonth
                          ? "border-red-500"
                          : "border-[color:var(--input)]"
                      )}
                      inputMode="numeric"
                    />
                    {cardErrors.expMonth && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.expMonth}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">YY / YYYY</label>
                    <input
                      value={cardForm.expYear}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, expYear: e.target.value })
                      }
                      className={cn(
                        "w-full h-10 px-3 rounded-md border bg-white",
                        cardErrors.expYear
                          ? "border-red-500"
                          : "border-[color:var(--input)]"
                      )}
                      inputMode="numeric"
                    />
                    {cardErrors.expYear && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.expYear}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">CVC</label>
                    <input
                      value={cardForm.cvc}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, cvc: e.target.value })
                      }
                      className={cn(
                        "w-full h-10 px-3 rounded-md border bg-white",
                        cardErrors.cvc
                          ? "border-red-500"
                          : "border-[color:var(--input)]"
                      )}
                      inputMode="numeric"
                    />
                    {cardErrors.cvc && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.cvc}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                ref={btnAddCardRef}
                disabled={addingCard}
                className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90 disabled:opacity-60"
              >
                {addingCard ? "Adding..." : "Add payment method"}
              </button>
            </form>
          </section>

          {/* Preferences */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Preferences</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Choose age range and topics you’re interested in.
            </p>

            <form
              onSubmit={handleSavePrefs}
              className="mt-5 space-y-3"
              aria-busy={savingPrefs}
            >
              <div>
                <label className="block text-sm mb-1">Age range</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                >
                  <option value="">Not set</option>
                  <option value="0-2">0–2</option>
                  <option value="3-5">3–5</option>
                  <option value="6-9">6–9</option>
                  <option value="10-12">10–12</option>
                  <option value="13+">13+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Interests</label>
                <input
                  value={interests.join(", ")}
                  onChange={(e) =>
                    setInterests(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  placeholder="toys, stroller, feeding, education"
                />
              </div>

              <button
                type="submit"
                ref={btnPrefsRef}
                disabled={savingPrefs}
                className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90 disabled:opacity-60"
              >
                {savingPrefs ? "Saving..." : "Save preferences"}
              </button>
            </form>
          </section>

          {/* Data & privacy */}
          <section className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Data & privacy</h2>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Download a copy of your data or delete your account.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={handleExportData}
                className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-[color:var(--border)] hover:bg-[color:var(--muted)]/40"
              >
                Request my data
              </button>

              <div className="pt-3">
                <label className="block text-sm mb-1">
                  Type <code>DELETE</code> to confirm account deletion
                </label>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[color:var(--input)] bg-white"
                  placeholder="DELETE"
                />
                <div className="mt-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={!confirmOk}
                    className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-red-600 text-white hover:opacity-90 disabled:opacity-60"
                  >
                    Delete my account
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Sign out */}
          <div className="flex items-center justify-between rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
            <div>
              <div className="font-medium">Sign out</div>
              <div className="text-sm text-[color:var(--muted-foreground)]">
                Sign out from this browser.
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-[color:var(--border)] hover:bg-[color:var(--muted)]/40"
            >
              Sign out
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default UserProfile;
