import React, { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const mockReviews = [
  {
    id: 1,
    name: "Maya T.",
    childAge: "4y",
    rating: 5,
    title: "Perfect for bedtime wind-down",
    body:
      "My daughter loves the tracing pack. We use it 10 minutes before bed—calm, focused, and screen smart.",
    avatar: "/images/reviews/user-1.jpg",
    verified: true,
  },
  {
    id: 2,
    name: "Kenji S.",
    childAge: "6y",
    rating: 5,
    title: "Instant download, zero friction",
    body:
      "Bought during a busy week—paid and downloaded in under a minute. Works great on tablet.",
    avatar: "/images/reviews/user-2.jpg",
    verified: true,
  },
  {
    id: 3,
    name: "Aom P.",
    childAge: "9y",
    rating: 4,
    title: "Fun + educational",
    body:
      "The emotion cards sparked real conversations. Would love more Thai/English bilingual sets!",
    avatar: "/images/reviews/user-3.jpg",
    verified: true,
  },
  {
    id: 4,
    name: "Linh N.",
    childAge: "3y",
    rating: 5,
    title: "Great for travel",
    body:
      "Printed a mini pack for the flight. Kept our toddler engaged—lifesaver.",
    avatar: "/images/reviews/user-4.jpg",
    verified: true,
  },
  {
    id: 5,
    name: "Ploy K.",
    childAge: "12y",
    rating: 5,
    title: "Worth every baht",
    body:
      "Clear instructions and age-appropriate difficulty. We’ll be back for the bundle.",
    avatar: "/images/reviews/user-5.jpg",
    verified: true,
  },
  {
    id: 6,
    name: "Arif D.",
    childAge: "6y",
    rating: 5,
    title: "Teacher-approved at home",
    body:
      "I teach primary school—this aligns well with milestones. Simple to set up, quick wins.",
    avatar: "/images/reviews/user-6.jpg",
    verified: true,
  },
];

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
  reviews = mockReviews,
}) {
  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  const trackRef = useRef(null);

  const scrollByCard = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-review-card]");
    const gap = 16;
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
          Real feedback from busy parents—quick wins, screen-smart activities.
        </p>
      </div>

      {/* Controls ขวาบน */}
      <div className="absolute top-8 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous reviews"
          className="rounded-full h-12 w-12"
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next reviews"
          className="rounded-full h-12 w-12"
          onClick={() => scrollByCard(1)}
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
        {reviews.map((r) => (
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
                <img src={r.avatar} alt={`${r.name} avatar`} className="h-full w-full object-cover" />
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
                <p className="text-xs text-muted-foreground">Child: {r.childAge}</p>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Stars rating={r.rating} />
              <h3 className="mt-2 text-sm font-semibold text-foreground">{r.title}</h3>
              <p className="mt-1 text-sm text-foreground/90">{r.body}</p>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date().toLocaleDateString()} • Purchased: Digital pack
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button className="rounded-full px-6 py-5">See all reviews</Button>
      </div>
    </section>
  );
}
