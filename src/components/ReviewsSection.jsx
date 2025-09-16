// src/components/ReviewsSection.jsx
import React, { useRef, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000/api/v1

function Stars({ rating = 5, size = "sm" }) {
  const sizeClass = size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm";
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "text-primary" : "text-foreground/30"}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsSection({
  title = "What parents are saying",
  productId,                 // ✅ ต้องส่ง productId มาเพื่อดึงรีวิวของสินค้านั้น
  page = 1,
  limit = 12,
}) {
  const trackRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // แทน mock
  const [error, setError] = useState(null);

  // ดึงข้อมูลรีวิวจากแบ็กเอนด์
  useEffect(() => {
    let ignore = false;
    async function fetchReviews() {
      if (!productId) {
        setLoading(false);
        setReviews([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const url = new URL(`${API_URL}/products/${productId}/reviews`);
        // ถ้าหลังบ้านรองรับการแบ่งหน้าในอนาคต:
        // url.searchParams.set("page", String(page));
        // url.searchParams.set("limit", String(limit));

        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.reviews) ? data.reviews : [];

        // แปลงให้เข้ากับ UI เดิม (มี fallback กันข้อมูลไม่ครบ)
        const mapped = list.map((r, idx) => ({
          id: r._id || idx,
          name: r.user?.name || "Anonymous",
          childAge: r.user?.childAge ? `${r.user.childAge}y` : "", // ไม่มีใน schema ตอนนี้
          rating: Number(r.rating) || 5,
          title: r.comment?.length > 48 ? r.comment.slice(0, 48) + "…" : (r.comment || "Review"),
          body: r.comment || "",
          avatar: r.user?.avatar || "/images/reviews/user-placeholder.jpg",
          verified: true, // ถ้ายังไม่มีฟิลด์จากหลังบ้าน ให้ถือว่า verified ไว้ก่อน
          createdAt: r.createdAt,
        }));

        if (!ignore) setReviews(mapped);
      } catch (err) {
        if (!ignore) setError(err?.message || "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchReviews();
    return () => { ignore = true; };
  }, [productId, page, limit]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const a = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length;
    return Math.round(a * 10) / 10;
  }, [reviews]);

  const scrollByCard = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-review-card]");
    const gap = 16; // ให้พอดีกับ gap-4
    const delta = card ? card.getBoundingClientRect().width + gap : 320;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-12">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="uppercase tracking-widest">
            Reviews
          </Badge>
          <Stars rating={Math.round(avg)} size="md" />
          <span className="text-sm text-muted-foreground">{avg}/5</span>
        </div>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm md:text-base text-muted-foreground">
          Real feedback from busy parents, quick wins, screen-smart activities.
        </p>
      </div>

      {/* ปุ่มควบคุมมุมขวาบน */}
      <div className="absolute top-8 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous reviews"
          className="rounded-full h-12 w-12"
          onClick={() => scrollByCard(-1)}
          disabled={loading || !reviews.length}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next reviews"
          className="rounded-full h-12 w-12"
          onClick={() => scrollByCard(1)}
          disabled={loading || !reviews.length}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* One-row carousel */}
      <div
        ref={trackRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2
        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loading ? (
          // skeleton ง่าย ๆ
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px]
              border-0 rounded-none shadow-[0_8px_24px_rgba(0,0,0,0.08)] animate-pulse h-48 bg-muted"
            />
          ))
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : !reviews.length ? (
          <div className="text-sm text-muted-foreground">No reviews yet.</div>
        ) : (
          reviews.map((r) => (
            <Card
              key={r.id}
              data-review-card
              className="
                snap-start flex-shrink-0
                w-[280px] sm:w-[320px] md:w-[360px]
                border-0 rounded-none
                shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                transition-shadow
              "
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-muted border">
                  <img
                    src={r.avatar}
                    alt={`${r.name} avatar`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                    {r.verified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/30 text-foreground/80">
                        Verified
                      </span>
                    )}
                  </div>
                  {r.childAge ? (
                    <p className="text-xs text-muted-foreground">Child: {r.childAge}</p>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Stars rating={r.rating} />
                <h3 className="mt-2 text-sm font-semibold text-foreground">{r.title}</h3>
                <p className="mt-1 text-sm text-foreground/90">{r.body}</p>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="mt-2 text-xs text-muted-foreground">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}{" "}
                  • Purchased: Digital pack
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button className="rounded-full px-6 py-5">See all reviews</Button>
      </div>
    </section>
  );
}
