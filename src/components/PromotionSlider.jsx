// src/components/PromotionSlider.jsx
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { ProductContext } from "../context/ProductContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PromotionSlider({
  title = "🎉 Today’s Promotion",
  limit = 5,
  autoPlayMs = 4500,
}) {
  const { products = [], loading } = useContext(ProductContext) || {};
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  const items = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    let promos = products.filter((p) => {
      const badge = String(p?.badge || "").toLowerCase();
      const flagged = p?.promo === true || p?.featured === true;
      const hasTag =
        Array.isArray(p?.tags) &&
        p.tags.some((t) => String(t).toLowerCase().includes("promo"));
      return flagged || hasTag || badge.includes("promo");
    });
    if (promos.length === 0) {
      promos = [...products].sort((a, b) => (b?.sales ?? 0) - (a?.sales ?? 0));
    }
    return promos.slice(0, limit);
  }, [products, limit]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % items.length);
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [items.length, autoPlayMs]);

  const go = (dir) => {
    if (items.length <= 1) return;
    setIndex((i) =>
      dir === "prev" ? (i - 1 + items.length) % items.length : (i + 1) % items.length
    );
  };

  const onPause = (v) => (pausedRef.current = v);

  if (loading) {
    return (
      <section className="w-screen left-1/2 -translate-x-1/2 px-0 py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="bg-muted rounded-md p-4">
            <div className="h-5 w-40 bg-muted-foreground/20 rounded animate-pulse mb-3" />
            <div className="w-full h-36 bg-muted-foreground/20 animate-pulse rounded" />
          </div>
        </div>
      </section>
    );
  }
  if (!items.length) return null;

  const current = items[index];

  const renderPrice = (p) => {
    const one = p?.prices?.oneTime;
    const monthly = p?.prices?.monthly;
    const yearly = p?.prices?.yearly;
    if (one) return `${one}฿`;
    if (monthly && yearly) return `${monthly}฿ – ${yearly}฿`;
    if (monthly) return `${monthly}฿/mo`;
    return p?.price ? `${p.price}฿` : "—";
  };

  return (
    <section
      className="
        relative w-screen left-1/2 -translate-x-1/2
        bg-muted/40
        py-6 md:py-8
      "
      onMouseEnter={() => onPause(true)}
      onMouseLeave={() => onPause(false)}
      onFocus={() => onPause(true)}
      onBlur={() => onPause(false)}
    >
      {/* Content ตรงกลาง ไม่เต็ม กำหนด max-w-7xl */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header + Controls */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous promotion"
              className="rounded-full h-9 w-9"
              onClick={() => go("prev")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next promotion"
              className="rounded-full h-9 w-9"
              onClick={() => go("next")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content layout */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-6 items-center">
          {/* Left: Square image */}
          <div className="flex items-center justify-center">
            {current?.image ? (
              <img
                src={current.image}
                alt={current?.name || "Promotion"}
                className="aspect-square w-full max-w-[220px] object-cover rounded-sm"
              />
            ) : (
              <div className="aspect-square w-full max-w-[220px] bg-muted rounded-sm" />
            )}
          </div>

          {/* Right: Details */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-foreground line-clamp-2">
              {current?.name || current?.title || "Untitled product"}
            </h4>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">
              {current?.description ||
                "Curated digital learning product—engaging, age-fit, and ready to use instantly."}
            </p>

            <div className="mt-2.5 flex items-center gap-3">
              <span className="text-base md:text-lg font-semibold text-foreground">
                {renderPrice(current)}
              </span>
              {Array.isArray(current?.tags) && current.tags.includes("sale") && (
                <span className="text-xs text-primary font-medium">Limited Offer</span>
              )}
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <Button asChild className="rounded-full px-5 py-3">
                <Link to={`/products/${current?.id}`}>View details</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-5 py-3"
              >
                <Link to={`/products?promo=1`}>More promotions</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "h-1.5 w-1.5 rounded-full transition",
                i === index
                  ? "bg-foreground"
                  : "bg-foreground/30 hover:bg-foreground/60",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
