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
  const [searchValue, setSearchValue] = useState("");

  const NAV_ITEMS = [
    { label: "All", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
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
      </div>
    </header>
  );
}
