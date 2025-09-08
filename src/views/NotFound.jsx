import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <img
        src="/images/logosvg.svg"
        alt="Logo"
        className="w-40 h-40 mb-6"
      />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        404 – Page Not Found
      </h1>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
