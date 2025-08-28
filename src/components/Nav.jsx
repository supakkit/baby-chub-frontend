import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartProvider"; // << ปุ้ยเตรียม context สำหรับ counting product in cart
import { SearchAutocomplete } from "./SearchAutocomplete";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { cartCount } = useCart();

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

  const HEADER_ACTIONS = [
    { label: "Log In", path: "/signin" },
    { label: "Sign Up", path: "/signup" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      {/* Top bar */}
      <div className="w-full h-7 bg-[#543285] text-white flex justify-end items-center px-6">
        <Link to="/help" className="text-sm hover:opacity-90">
          Help
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:grid grid-cols-3 items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logowithtext.svg"
            alt="Baby Chub Brand"
            className="h-12 w-auto"
          />
        </Link>

        {/* Navigation Menu with dropdown */}
        <nav className="flex justify-center gap-6 relative">
          {NAV_ITEMS.map((item) => (
            <div key={item.path} className="group relative">
              <Link
                to={item.path}
                className="text-gray-700 hover:text-[#543285] font-medium"
              >
                {item.label}
              </Link>
              {item.dropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className="block px-4 py-2 hover:bg-[#543285] hover:text-white text-sm"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Search + Icons + Buttons */}
        <div className="flex items-center justify-end gap-4">
          <SearchAutocomplete />
          <Link to="/favorite">
            <img src="/images/heart.svg" alt="Favorite" className="w-6 h-6" />
          </Link>
          <Link to="/profile">
            <img src="/images/person.svg" alt="Profile" className="w-6 h-6" />
          </Link>
          <Link to="/cart" className="relative">
            <img src="/images/cart.svg" alt="Cart" className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
          {HEADER_ACTIONS.map((a) => (
            <Button key={a.label} asChild>
              <Link to={a.path}>{a.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-between px-4 py-2">
        <Link to="/">
          <img
            src="/images/logowithtext.svg"
            alt="Baby Chub Brand"
            className="h-14 w-auto"
          />
        </Link>

        <Input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 mx-2"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.path} className="flex flex-col gap-1">
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-[#543285] font-medium"
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 flex flex-col gap-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="text-gray-600 hover:text-[#543285] text-sm"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              {HEADER_ACTIONS.map((a) => (
                <Button key={a.label} asChild>
                  <Link to={a.path}>{a.label}</Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
