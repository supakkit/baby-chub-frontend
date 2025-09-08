// src/views/HowItWorks.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react"; // ลูกศร

const steps = [
  { id: 1, emoji: "🔐", title: "Sign in", desc: "Create an account or log in." },
  { id: 2, emoji: "🧭", title: "Find what fits", desc: "Filter by Age, Subject, or Type." },
  { id: 3, emoji: "❤️🛒", title: "Save or add", desc: "Favorite or add to cart." },
  { id: 4, emoji: "✨", title: "Checkout & enjoy", desc: "Pay securely and access instantly." },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
      {/* Header */}
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">How it works</h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          A simple flow to start learning with BabyChub.
        </p>
      </header>

      {/* Steps in one row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            {/* Step card */}
            <div className="bg-white shadow-md rounded-xl p-6 md:p-7 w-full sm:w-56 flex flex-col items-center gap-3 text-center">
              <div className="text-4xl md:text-5xl">{s.emoji}</div>
              <h3 className="text-base md:text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-foreground/80">{s.desc}</p>
            </div>

            {/* Arrow (except last) */}
            {i < steps.length - 1 && (
              <ArrowRight className="hidden md:block h-8 w-8 text-muted-foreground shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 md:mt-16 text-center">
        <p className="mb-4 text-base md:text-lg font-medium text-foreground">
          🚀 Ready to begin your BabyChub journey?
        </p>
        <div className="max-w-sm mx-auto flex flex-col gap-3">
          <Button asChild className="rounded-full px-6 py-5 justify-center">
            <Link to="/signin">🔐 Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6 py-5 justify-center">
            <Link to="/products">🛍️ Browse products</Link>
          </Button>
        </div>

        {/* Help link */}
        <div className="mt-6">
          <Link to="/help" className="text-sm text-primary underline underline-offset-4">
            Need help?
          </Link>
        </div>
      </div>
    </section>
  );
}
