import React, { useState } from "react";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "All", view: "products" },
  { label: "New Arrival", view: "product" },
  { label: "Ages 3 - 4", view: "product" },
  { label: "Ages 4 - 6", view: "product" },
  { label: "Ages 6 - 9", view: "product" },
  { label: "Ages 9 - 12", view: "product" },
];

export default function Nav({ navigateToView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (view) => {
    if (navigateToView) {
      navigateToView(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#FBB5B8] to-white shadow-sm relative text-[#543285]">
      <div className="container py-3">
        {/* Top Bar: Help and Sign In */}
        <div className="flex items-center justify-end text-xs sm:text-sm font-semibold text-[#A599D7] space-x-4 mb-1">
          <button
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A599D7] rounded"
            onClick={() => window.alert("Help clicked")}
          >
            Help
          </button>
          <button
            onClick={() => handleNavigate("signIn")}
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A599D7] rounded"
          >
            Sign Up
          </button>
        </div>

        {/* Main Nav: Logo, Menu, and Search/Icons */}
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigate("home")}
          >
            <img
              src="/images/Logo.svg"
              alt="Logo Icon"
              className="h-16 sm:h-20"
            />
            <img
              src="/images/babuchub.svg"
              alt="Logo Text"
              className="h-6 sm:h-8"
            />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex flex-grow justify-center">
            <ul className="flex gap-4 text-[#543285] text-sm font-medium">
              {menuItems.map(({ label, view }) => (
                <li key={label}>
                  <button
                    onClick={() => handleNavigate(view)}
                    className="hover:text-[#A599D7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A599D7] rounded transition"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto md:w-auto">
            {/* Search Bar (ซ่อนบนมือถือ) */}
            <div className="relative flex-grow hidden md:block">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                className="w-full border border-[#543285] rounded-full py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A599D7]"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate("cart")}
              >
                <ShoppingCart className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.alert("Account clicked")}
              >
                <User className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate("favorite")}
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu (แสดงเมื่อ mobileMenuOpen เป็น true) */}
        {mobileMenuOpen && (
          <nav className="sm:hidden mt-3 bg-white rounded-lg shadow-md p-4">
            <ul className="flex flex-col gap-3 text-[#543285] font-medium">
              {menuItems.map(({ label, view }) => (
                <li key={label}>
                  <button
                    onClick={() => handleNavigate(view)}
                    className="w-full text-left p-2 rounded hover:bg-gray-100 hover:text-[#A599D7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A599D7]"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
