// src/components/FeaturedSlider.jsx
import React, { useRef, useContext, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ ใช้ไอคอนแบบเดียวกับรีวิว

// bigger gap for clean look
const GAP_PX = 32; // 32px = Tailwind gap-8

export default function FeaturedSlider({
  title = "Fresh Finds for Little Minds",
  limit = 12,
  autoPlayMs = 3500,
}) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  const { loading, products: ctxProducts } = useContext(ProductContext) || {};
  const baseProducts = Array.isArray(ctxProducts) ? ctxProducts : [];

  const featuredProducts = useMemo(() => {
    if (!baseProducts.length) return [];
    let candidates = baseProducts.filter((p) => {
      const bool = p?.featured === true;
      const tag =
        Array.isArray(p?.tags) &&
        p.tags.some((t) => String(t).toLowerCase() === "featured");
      const badge = String(p?.badge || "").toLowerCase() === "featured";
      return bool || tag || badge;
    });
    if (candidates.length === 0) {
      candidates = [...baseProducts].sort(
        (a, b) => (b?.sales ?? 0) - (a?.sales ?? 0)
      );
    }
    return candidates.slice(0, limit);
  }, [baseProducts, limit]);

  const getCardWidth = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const firstCard = el.querySelector("[data-card]");
    if (!firstCard) return 0;
    return firstCard.getBoundingClientRect().width;
  };

  const scrollByOne = (dir = "next") => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = getCardWidth() || el.clientWidth / 4;
    const amount = cardW + GAP_PX;
    el.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  // autoplay (pause on hover/focus)
  useEffect(() => {
    if (!trackRef.current) return;
    if (featuredProducts.length <= 4) return;

    const el = trackRef.current;
    const step = () => {
      if (pausedRef.current) return;
      const cardW = getCardWidth() || el.clientWidth / 4;
      const amount = cardW + GAP_PX;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + amount;

      if (nextLeft >= maxScroll - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
    };

    const timer = setInterval(step, autoPlayMs);
    return () => clearInterval(timer);
  }, [featuredProducts.length, autoPlayMs]);

  if (loading) {
    return (
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="h-5 w-52 bg-muted rounded animate-pulse mb-4" />
        <div className="flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-muted rounded-xl animate-pulse flex-1"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">
          {title}
        </h3>
      </div>

      {/* Controls — มุมขวาบน แบบเดียวกับ ReviewsSection */}
      <div className="absolute top-6 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous"
          className="rounded-full h-12 w-12"
          onClick={() => scrollByOne("prev")}
          onMouseEnter={() => (pausedRef.current = true)}
          onFocus={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onBlur={() => (pausedRef.current = false)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next"
          className="rounded-full h-12 w-12"
          onClick={() => scrollByOne("next")}
          onMouseEnter={() => (pausedRef.current = true)}
          onFocus={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onBlur={() => (pausedRef.current = false)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* 4-up: smaller cards + bigger gaps for a clean look */}
      <div
        ref={trackRef}
        className={`
          flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        `}
        style={{ ["--card-gap"]: `${GAP_PX}px` }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onFocus={() => (pausedRef.current = true)}
        onBlur={() => (pausedRef.current = false)}
      >
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            data-card
            className="snap-start shrink-0"
            style={{ width: "calc((100% - (3 * var(--card-gap))) / 4)" }}
          >
            <ProductCard product={product} />
          </article>
        ))}
      </div>
    </section>
  );
}
