import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { CartContext } from "../context/CartContext";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { SignIn } from "@/views/SignIn";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion } from "framer-motion";

export default function Nav() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems?.length || 0;
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const isAuthed = !!user?.id;

  const isAdmin = user?.role === "admin";

  const requireAuth = (action) => {
    if (!isAuthed) {
      toast.error("Please Sign In / Sign Up to continue");
      setSignInOpen(true); // เปิด Dialog Sign In
      return;
    }
    action(); // ทำ action ถ้า login แล้ว
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const NAV_ITEMS = [
    {
      label: "All",
      path: "/products",
      // dropdown: [
      //   { label: "By Ages 3 - 4", path: "/all/ages-3-4" },
      //   { label: "By Ages 4 - 6", path: "/all/ages-4-6" },
      //   { label: "By Ages 6 - 9", path: "/all/ages-6-9" },
      //   { label: "By Ages 9 - 12", path: "/all/ages-9-12" },
      // ],
    },
    { label: "New Arrival", path: "/new" },
    { label: "About Us", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      {/* Top bar */}
      <div className="w-full h-7 bg-[#543285] text-white flex justify-end items-center px-6">
        <motion.div
          whileHover={{ x: 5, scale: 1.05 }}
          whileTap={{ x: 6, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Link to="/help" className="text-sm hover:opacity-90">
            Help
          </Link>
        </motion.div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:grid grid-cols-3 items-center px-6 py-3">
        {/* Logo (left) */}
        <motion.div
          whileHover={{ x: 5, scale: 1.05 }}
          whileTap={{ x: 6, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Link to="/" className="flex items-center">
            <img
              src="/images/logowithtext.svg"
              alt="Baby Chub Brand"
              className="h-12 w-auto"
            />
          </Link>
        </motion.div>

        {/* Center menu */}
        <nav className="flex justify-center gap-12 relative">
          {NAV_ITEMS.map((item) => (
            <div key={item.path} className="group relative">
              <Link to={item.path}>
                <motion.span
                  whileHover={{ scale: 1.1, color: "#7d52ba" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    duration: 0.2,
                  }}
                  className="text-purple-900 font-bold cursor-pointer inline-block"
                >
                  {item.label}
                </motion.span>
              </Link>

              {item.dropdown && (
                <div className="absolute left-2 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-auto group-hover:pointer-events-auto z-50">
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

        {/* Right controls (search, favorite, cart, sign in/profile) */}
        <div className="flex items-center justify-end gap-4">
          {/* Desktop Search */}
          <SearchAutocomplete />

          {isAdmin && (
            <Link className="font-bold hover:opacity-80" to="/admin/dashboard">
              Admin
            </Link>
          )}

          {/* Favorite */}
          <motion.button
            whileHover={{ scale: 1.1, color: "#7d52ba" }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              duration: 0.2,
            }}
            onClick={() => requireAuth(() => navigate("/favorite"))}
            title="Favorite"
            className="cursor-pointer"
          >
            <img src="/images/heart.svg" alt="Favorite" className="w-14 h-14" />
          </motion.button>

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.1, color: "#7d52ba" }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              duration: 0.2,
            }}
            onClick={() => requireAuth(() => navigate("/cart"))}
            title="Cart"
            className="relative cursor-pointer"
          >
            <img
              src="/images/cart.svg"
              alt="Cart"
              className="w-14 h-14 items-center justify-center"
            />
            {cartCount > 0 && (
              <span className="absolute -right-0 -top-0 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Sign In / Profile + Library */}
          {isAuthed ? (
            <>
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Link to="/profile" title="My Account">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </motion.div>

              {/* Library / My Orders */}
              <motion.button
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                onClick={() => navigate("/library")}
                title="My Library"
                className="relative w-12 h-12 flex items-center justify-center"
              >
                <img
                  src="/images/librarybook.svg"
                  alt="Library"
                  className="cursor-pointer"
                />
              </motion.button>

              {/* Log out */}

              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Button asChild className="cursor-pointer">
                  <button onClick={handleLogout}>Log out</button>
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Sign In (Dialog) */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
                  <DialogTrigger asChild>
                    <button title="Sign In" className="w-8 h-8">
                      <img
                        src="/images/person.svg"
                        alt="Sign In"
                        className="items-center w-8 h-8 cursor-pointer"
                      />
                    </button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md cursor-pointer">
                    <DialogTitle>
                      <VisuallyHidden>Sign In</VisuallyHidden>
                    </DialogTitle>
                    <SignIn onSuccess={() => setSignInOpen(false)} />
                  </DialogContent>
                </Dialog>
              </motion.div>

              {/* Sign Up */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-start px-2 py-3 cursor-pointer">
        <Link to="/" className="flex items-start">
          <img
            src="/images/logowithtext.svg"
            alt="Baby Chub Brand"
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex items-center justify-end gap-2 ml-6">
          {/* Mobile Search */}
          <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
            <DialogTrigger asChild>
              <button>
                <Search className="w-8 h-8 cursor-pointer" />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-full w-full h-screen p-4 flex flex-col">
              <DialogTitle>
                <VisuallyHidden>Search Products</VisuallyHidden>
              </DialogTitle>

              <div className="flex flex-col flex-1">
                <SearchAutocomplete
                  onSelect={(productId) => {
                    setMobileSearchOpen(false);
                    navigate(`/products/${productId}`);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Avatar (แสดงเฉพาะถ้า login) */}
          {isAuthed && (
            <Link to="/profile" title="My Account">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          {/* Library / My Orders */}
          {isAuthed && (
            <Link
              to="/library"
              title="My Library"
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <img
                src="/images/librarybook.svg"
                alt="Library"
                className="w-8 h-8 cursor-pointer"
              />
              {user?.ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {user.ordersCount}
                </span>
              )}
            </Link>
          )}

          {/* Favorite */}
          <button
            onClick={() => requireAuth(() => navigate("/favorite"))}
            title="Favorite"
          >
            <img
              src="/images/heart.svg"
              alt="Favorite"
              className="w-8 h-8 cursor-pointer"
            />
          </button>

          {/* Cart */}
          <button
            onClick={() => requireAuth(() => navigate("/cart"))}
            title="Cart"
            className="relative"
          >
            <img
              src="/images/cart.svg"
              alt="Cart"
              className="w-8 h-8 cursor-pointer"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
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
                {isAuthed ? (
                  <Button onClick={handleLogout}>Log out</Button>
                ) : (
                  <Button asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
