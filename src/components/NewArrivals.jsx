// src/components/NewArrivals.jsx
import React, { useRef, useContext, useMemo, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ProductContext } from "../context/ProductContext";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000/api/v1
const GAP_PX_DEFAULT = 16;

// ── axios instance ─────────────────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ถ้า backend ใช้ cookie/เซสชัน
});

export default function NewArrivals({
  title = "Fresh Finds for Little Minds",
  limit = 12,
  autoPlayMs = 3500,
  gapPx = GAP_PX_DEFAULT,
}) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  const ctx = useContext(ProductContext) || {};
  const ctxLoading = !!ctx.loading;
  const ctxProducts = Array.isArray(ctx.products) ? ctx.products : [];

  const [apiLoading, setApiLoading] = useState(false);
  const [apiProducts, setApiProducts] = useState([]);
  const [apiError, setApiError] = useState(null);

  // fetch โดย axios (ใช้ก็ต่อเมื่อ context ไม่มีของ)
  useEffect(() => {
    let ignore = false;

    async function fetchFromApi() {
      if (ctxProducts.length > 0) return;
      if (!API_URL) {
        setApiError("VITE_API_URL is not defined. Please set it in .env");
        return;
      }
      try {
        setApiLoading(true);
        setApiError(null);

        const { data } = await api.get("/new-products", {
          params: { limit: String(limit) },
        });

        const list = Array.isArray(data?.products) ? data.products : [];
        if (!ignore) setApiProducts(list);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Fetch error (axios)";
        if (!ignore) setApiError(msg);
      } finally {
        if (!ignore) setApiLoading(false);
      }
    }

    fetchFromApi();
    return () => {
      ignore = true;
    };
  }, [ctxProducts.length, limit]);

  // เลือก datasource: context ก่อน, ไม่มีก็ใช้ api
  const baseProducts = ctxProducts.length ? ctxProducts : apiProducts;

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
    const first = el.querySelector("[data-card]");
    return first ? first.getBoundingClientRect().width : 0;
  };

  const scrollByOne = (dir = "next") => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = getCardWidth() || el.clientWidth / 4;
    const amount = cardW + gapPx;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  // autoplay
  useEffect(() => {
    if (!trackRef.current) return;
    if (featuredProducts.length <= 4) return;
    const el = trackRef.current;
    const step = () => {
      if (pausedRef.current) return;
      const cardW = getCardWidth() || el.clientWidth / 4;
      const amount = cardW + gapPx;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + amount;
      if (nextLeft >= maxScroll - 1) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: amount, behavior: "smooth" });
    };
    const timer = setInterval(step, autoPlayMs);
    return () => clearInterval(timer);
  }, [featuredProducts.length, autoPlayMs, gapPx]);

  // Loading / Error
  if (ctxLoading || apiLoading) {
    return (
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="h-5 w-52 bg-muted rounded animate-pulse mb-4" />
        <div className="flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse flex-1" />
          ))}
        </div>
      </section>
    );
  }

  if (!ctxProducts.length && apiError) {
    return (
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="text-sm text-red-600">
          Failed to load new arrivals: {apiError}
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10 newarrivals-no-fav">
      {/* ซ่อนไอคอนหัวใจจาก ProductCard เฉพาะใน section นี้ */}
      <style>{`
        .newarrivals-no-fav button.absolute.top-3.right-3.bg-white.p-2.rounded-full.shadow {
          display: none !important;
        }
      `}</style>

      <div className="mb-3">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">{title}</h3>
      </div>

      {/* Controls */}
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

      <div
        ref={trackRef}
        className="
          flex gap-[var(--card-gap)] overflow-x-auto scroll-smooth snap-x snap-mandatory
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
        style={{ ["--card-gap"]: `${gapPx}px` }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onFocus={() => (pausedRef.current = true)}
        onBlur={() => (pausedRef.current = false)}
      >
        {featuredProducts.map((product) => (
          <article
            key={product.id || product._id}
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
