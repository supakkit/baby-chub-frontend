import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function Nav() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          BabyChub
        </Link>

        {/* Menu Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-secondary transition-colors"
          >
            Products
          </Link>
          <Link to="/about" className="hover:text-secondary transition-colors">
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-secondary transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Cart Button */}
        <Link to="/cart">
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-2">
            <ShoppingCart size={18} />
            Cart
          </Button>
        </Link>
      </div>
    </nav>
  );
}
