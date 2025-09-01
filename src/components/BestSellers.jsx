import React, { useMemo /*, useContext */ } from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { ProductContext } from "../context/ProductContext";

export default function BestSellers() {
  // TODO: ภายหลังสลับมาใช้ context ที่เดียวกับ Product
  // const { products: ctxProducts } = useContext(ProductContext) || {};
  // const itemsFromCtx = Array.isArray(ctxProducts)
  //   ? ctxProducts.map(p => ({ id: p.id, title: p.title || p.name, image: p.img || p.image || p.thumbnail }))
  //   : [];

  const mock = [
    { id: 1, title: "Toy #1", image: "/images/3Levels.png" },
    { id: 2, title: "Toy #2", image: "/images/programming-course-forest-adventure.png" },
    { id: 3, title: "Toy #3", image: "/images/money2.jpg" },
    { id: 4, title: "Toy #4", image: "/images/Daily6yr2.png" },
    { id: 5, title: "Toy #5", image: "/images/LearningTime.png" },
  ];

  const items = useMemo(() => {
    // return itemsFromCtx.length ? itemsFromCtx : mock;
    return mock;
  }, []);

  const [first, second, third] = items; // mock: เดี๋ยวค่อยจัดอันดับตามยอดซื้อทีหลัง

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 bg-gradient-to-b from-white to-muted/40 py-12 md:py-16">
      <div className="layout">
        <h2 className="text-3xl font-bold text-foreground text-center mb-2">
          ✨ Loved by Little Learners ✨
        </h2>
        <p className="text-center text-secondary/80 mb-8">
          Discover the picks that parents can’t stop talking about.
        </p>

        {/* PODIUM 2 – 1 – 3 */}
        <div className="relative mx-auto flex items-end justify-center gap-4 md:gap-8">
          {/* Aura วิ้ง ๆ หลังอันดับ 1 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-48 w-48 md:h-64 md:w-64 rounded-full bg-pink-200/40 blur-3xl animate-pulse" />
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 h-56 w-56 md:h-72 md:w-72 rounded-full bg-purple-200/30 blur-3xl animate-[spin_16s_linear_infinite]" />
            </div>
          </div>

          {/* Rank 2 (ซ้าย) */}
          {second && (
            <PodiumCard
              item={second}
              rank={2}
              size="sm"
              className="translate-y-4 md:translate-y-6"
              badgeBg="bg-secondary"
            />
          )}

          {/* Rank 1 (กลาง) */}
          {first && (
            <PodiumCard
              item={first}
              rank={1}
              size="lg"
              className="z-10 -translate-y-2 md:-translate-y-4"
              badgeBg="bg-accent"
            />
          )}

          {/* Rank 3 (ขวา) */}
          {third && (
            <PodiumCard
              item={third}
              rank={3}
              size="sm"
              className="translate-y-4 md:translate-y-6"
              badgeBg="bg-muted"
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ===== การ์ดโพเดียมพร้อมป้ายอันดับที่จัดกลางวงรีเนียน ๆ ===== */
function PodiumCard({ item, rank, size = "sm", className = "", badgeBg = "bg-secondary" }) {
  const isGold = rank === 1;
  const isSilver = rank === 2;
  const isBronze = rank === 3;

  const sizes = {
    sm: "w-40 md:w-56",
    lg: "w-56 md:w-72",
  };

  const medal = isGold ? "🏆" : isSilver ? "🥈" : "🥉";
  const label = isGold ? "No.1" : isSilver ? "No.2" : "No.3";

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* ป้ายอันดับ (วงรี) — จัดให้อยู่กึ่งกลางแนวตั้ง/แนวนอนแบบเป๊ะ */}
      <div className="absolute -top-3 -left-3 z-20">
        <div
          className={[
            "inline-flex items-center justify-center h-9 min-w-[88px] px-3 rounded-full",
            "border border-border/50 shadow-sm leading-none",
            badgeBg,
            "text-foreground",
          ].join(" ")}
        >
          <span className="mr-1 text-base leading-none align-middle">{medal}</span>
          <span className="text-xs md:text-sm font-semibold leading-none align-middle">
            {label}
          </span>
        </div>
      </div>

      <Card
        className={[
          "overflow-hidden transition-all duration-300",
          isGold ? "ring-2 ring-primary shadow-2xl hover:-translate-y-1" : "hover:shadow-xl hover:-translate-y-1",
        ].join(" ")}
      >
        <CardContent className="p-0">
          <div className="relative">
            <img src={item.image} alt={item.title} className="w-full aspect-square object-cover" />
            {isGold && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-primary/20 to-transparent" />
            )}
          </div>
          <div className="p-3 text-center">
            <p className="font-semibold text-card-foreground truncate">{item.title}</p>
          </div>
        </CardContent>
      </Card>

      {/* ฐานโพเดียม */}
      <div
        className={[
          "mx-auto mt-2 h-2 rounded-full",
          isGold ? "w-3/4 bg-primary/50" : isSilver ? "w-2/3 bg-secondary/40" : "w-2/3 bg-muted/60",
        ].join(" ")}
      />
    </div>
  );
}
