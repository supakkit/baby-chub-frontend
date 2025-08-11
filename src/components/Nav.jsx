// src/components/Nav.jsx
import React, { useState } from "react";
import { NAV_ITEMS, HEADER_ACTIONS, ICON_BUTTONS } from "./nav-helpers";

// ปรับ path รูปตามโปรเจกต์ของปุ้ย (แนะนำวางไว้ใน src/assets/)
import search from "/images/search.svg";
import logoMark from "/images/logosvg.svg";
import logoText from "/images/logosvg.svg";
import user from "/images/person.svg";
import cart from "/images/cart.svg";
import favorite from "/images/heart.svg";

export default function Nav({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleNavigate = (view) => {
    setMenuOpen(false);
    if (onNavigate) onNavigate(view);
  };

  return (
    <header className="bg-background text-foreground shadow-sm">
      {/* Top thin bar (secondary color background) */}
      <div className="w-full bg-variable-collection-secondary">
        <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center justify-end gap-4 text-sm text-[color:var(--secondary-foreground)]">
          {HEADER_ACTIONS.map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="relative top-0 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4 md:py-5">
          {/* Left logos */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavigate("home")}
            aria-label="Go to home"
          >
            <img
              src={logoMark}
              alt="Baby Chub Brand"
              className="w-[56px] h-[46px] object-contain"
            />
            <img
              src={logoText}
              alt="Baby Chub"
              className="w-[120px] h-[28px] object-contain"
            />
          </div>

          {/* Desktop navigation items (center) */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Product categories"
          >
            {NAV_ITEMS.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.view)}
                aria-pressed={item.active}
                className={`relative text-sm font-medium whitespace-nowrap
                  ${
                    item.active
                      ? "text-[color:var(--variable-collection-primary)]"
                      : "text-[color:var(--foreground)]"
                  }
                  hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]`}
              >
                {item.label}
                {/* optional active underline to match Figma */}
                {item.active && (
                  <span className="absolute -bottom-4 left-0 w-full h-1 rounded bg-[color:var(--variable-collection-primary)]" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side: Search (desktop), icons, mobile menu button */}
          <div className="flex items-center gap-4">
            {/* Search box - visible from md up (keeps Figma layout where search sits right side) */}
            <div className="hidden md:flex items-center bg-white rounded-[20px] shadow-[0_2px_2px_rgba(0,0,0,0.25)] px-3 py-2">
              <button type="submit" aria-label="Search" className="mr-2">
                <img src={search} alt="search icon" className="w-8 h-8" />
              </button>
              <input
                id="search-input"
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                className="w-44 md:w-60 lg:w-72 text-sm placeholder:opacity-60 outline-none bg-transparent"
              />
            </div>

            {/* Icon buttons (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                aria-label="favorite"
                onClick={() => handleNavigate("notifications")}
                className="w-9 h-9 rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
              >
                <img
                  src={favorite}
                  alt="User Icon"
                  className="w-full h-full object-contain"
                />
              </button>
              <button
                type="button"
                aria-label="profile"
                onClick={() => handleNavigate("profile")}
                className="w-9 h-9 rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
              >
                <img
                  src={user}
                  alt="profile"
                  className="w-full h-full object-contain"
                />
              </button>
              <button
                type="button"
                aria-label="cart"
                onClick={() => handleNavigate("cart")}
                className="w-9 h-9 rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
              >
                <img
                  src={cart}
                  alt="cart"
                  className="w-full h-full object-contain"
                />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown - slide down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-3 bg-background">
          {/* Mobile search (on top of mobile menu) */}
          <div className="flex items-center bg-white rounded-[12px] shadow px-3 py-2 mb-3">
            <button className="mr-3" aria-label="search">
              <img src={search} alt="search" className="w-7 h-7" />
            </button>
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>

          {/* Mobile nav items */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((it) => (
              <button
                key={it.label}
                onClick={() => handleNavigate(it.view)}
                className={`text-left py-2 px-2 rounded text-sm font-medium
                   ${
                     it.active
                       ? "text-[color:var(--variable-collection-primary)]"
                       : "text-[color:var(--foreground)]"
                   }
                   hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)] transition`}
              >
                {it.label}
              </button>
            ))}
          </nav>

          {/* header actions in mobile */}
          <div className="mt-4 border-t pt-3 flex flex-col gap-2">
            {HEADER_ACTIONS.map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="text-sm text-[color:var(--foreground)] hover:text-[color:var(--variable-collection-primary)]"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
