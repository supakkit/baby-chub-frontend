import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "./SearchAutocomplete";

export default function Nav() {

function Nav({ cartCount = 0 }) {
  // desktop dropdown: เปิดตาม index ของ NAV_ITEMS
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); // number | null
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const NAV_ITEMS = [
    {
      label: "All",
      path: "/products",
      dropdown: [
        { label: "Ages 3 - 4", path: "/all/ages-3-4" },
        { label: "Ages 4 - 6", path: "/all/ages-4-6" },
        { label: "Ages 6 - 9", path: "/all/ages-6-9" },
        { label: "Ages 9 - 12", path: "/all/ages-9-12" },
      ],
    },
    { label: "About", path: "/about" },
    { label: "New Arrival", path: "/new" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* =================== Top thin bar (สีม่วง) =================== */}
      <div className="w-full h-7 bg-[#543285] text-white flex justify-end items-center px-6 gap-4">
        <Link to="/signin" className="hover:opacity-90 text-sm">
          Help
        </Link>
      </div>

      {/* =================== Desktop Nav =================== */}
      <div className="hidden md:grid grid-cols-3 items-center px-6 py-3 bg-white">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex gap-3 cursor-pointer"
          aria-label="Go to home"
        >
          <img
            src="/images/logowithtext.svg"
            alt="Baby Chub Brand"
            className="h-12 w-auto"
          />
        </Link>

        {/* Center: Nav Links */}
        <nav className="flex justify-around gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-gray-700 hover:text-[#543285] font-xl bold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search + Buttons */}
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center justify-end gap-3">
            <SearchAutocomplete />
            <Button variant="outline">LogIn</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </div>

      {/* =================== Mobile Nav =================== */}
      <div className="flex md:hidden items-center justify-between px-4 py-2 gap-3 bg-white">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center cursor-pointer"
          aria-label="Go to home"
        >
          <img
            src="/images/logowithtext.svg"
            alt="Baby Chub Brand"
            className="h-14 w-auto"
          />
        </Link>

        {/* Middle: Search Bar (อยู่บน header เสมอ) */}
        <Input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 mx-2"
        />

        {/* Right: Hamburger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-[#543285] font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="outline">Log In</Button>
              <Button>Sign Up</Button>
            </div>
          </SheetContent>
        </Sheet>
          {/* Right side: Search + icons (ใช้รูปจาก public/) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search box */}
            <div className="flex items-center bg-white rounded-[20px] shadow px-3 py-2">
              <button type="submit" className="mr-2" onClick={() => alert(`Searching for: ${searchValue}`)}>
                {/* ✅ เปลี่ยนเป็น src="/images/..." */}
                <img src="/images/search.svg" alt="search icon" className="w-8 h-8" />
              </button>
              <input
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-44 md:w-60 lg:w-72 text-sm placeholder:opacity-60 outline-none bg-transparent"
              />
            </div>

            {/* Favorite */}
            <Link to="/favorite" className="w-9 h-9">
              {/* ✅ เปลี่ยนเป็น src="/images/..." */}
              <img src="/images/heart.svg" alt="favorite" className="w-full h-full object-contain" />
            </Link>

            {/* Profile */}
            <Link to="/profile" className="w-9 h-9">
              {/* ✅ เปลี่ยนเป็น src="/images/..." */}
              <img src="/images/person.svg" alt="profile" className="w-full h-full object-contain" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="w-9 h-9 relative">
              {/* ✅ เปลี่ยนเป็น src="/images/..." */}
              <img src="/images/cart.svg" alt="cart" className="w-full h-full object-contain" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">0</span>
            </Link>
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

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="md:hidden bg-background px-4 pb-6 pt-3 shadow-md rounded-b-md" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="block py-2 px-3 rounded hover:bg-[color:var(--variable-collection-primary)] hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {/* mobile submenu */}
                  {item.dropdown && (
                    <ul className="ml-4 mt-1 flex flex-col gap-1">
                      {item.dropdown.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.path}
                            className="block py-1 px-3 rounded hover:bg-[color:var(--variable-collection-primary)] hover:text-white transition text-sm"
                            onClick={() => setMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              {/* Header actions (mobile) */}
              {HEADER_ACTIONS.map((a) => (
                <li key={a.label}>
                  <Link
                    to={a.path}
                    className="block py-2 px-3 rounded hover:bg-[color:var(--variable-collection-primary)] hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
