import React, { useRef, useContext, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";

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
      const tag = Array.isArray(p?.tags) && p.tags.some((t) => String(t).toLowerCase() === "featured");
      const badge = String(p?.badge || "").toLowerCase() === "featured";
      return bool || tag || badge;
    });
    if (candidates.length === 0) {
      candidates = [...baseProducts].sort((a, b) => (b?.sales ?? 0) - (a?.sales ?? 0));
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
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  // autoplay (pause on hover)
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
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="h-5 w-52 bg-muted rounded animate-pulse mb-4" />
        <div className="flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse flex-1" />
          ))}
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous"
            onClick={() => scrollByOne("prev")}
            className="rounded-full h-9 w-9"
          >
            ‹
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next"
            onClick={() => scrollByOne("next")}
            className="rounded-full h-9 w-9"
          >
            ›
          </Button>
        </div>
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
      >
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            data-card
            className="snap-start shrink-0"
            // smaller width + bigger spacing -> still 4 visible at once
            style={{ width: "calc((100% - (3 * var(--card-gap))) / 4)" }}
          >
            <ProductCard product={product} />
          </article>
        ))}
      </div>
    </section>
  );
}
