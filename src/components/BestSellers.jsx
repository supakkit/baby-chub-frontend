// src/components/BestSellers.jsx
import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000/api/v1

// สร้าง axios instance เผื่อใช้ซ้ำ
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ถ้า backend มี cookie/session
});

export default function BestSellers() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  // fallback mock เผื่อ backend ล่ม
  const mock = [
    { id: "m1", title: "3 Levels Tracing Pack", desc: "Fine-motor tracing set for calm, focused practice every day. Includes progressive difficulty and printable sheets.", image: "/images/3Levels.png" },
    { id: "m2", title: "Forest Coding Adventure", desc: "Beginner-friendly coding fundamentals with playful quests. Perfect on tablet—unplugged & screen-smart.", image: "/images/programming-course-forest-adventure.png" },
    { id: "m3", title: "Money Math Cards", desc: "Practical money skills: counting, change, and everyday problem-solving with Thai context.", image: "/images/money2.jpg" },
    { id: "m4", title: "Daily Pack Age 6", desc: "Handpicked daily activities that build core skills in minutes—fun and structured.", image: "/images/Daily6yr2.png" },
    { id: "m5", title: "Learning Time Kit", desc: "Screen-smart learning routines your kid will love. Quick wins, clear progress.", image: "/images/LearningTime.png" },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 20 } });
        const list = Array.isArray(data?.products) ? data.products : [];
        const normalized = list.map((p) => ({
          id: p._id || p.id,
          title: p.name || p.title || "Untitled",
          desc: p.description || "",
          image:
            (Array.isArray(p.images) && p.images[0]) ||
            p.image ||
            p.thumbnail ||
            "/images/placeholder.png",
        }));

        // สุ่มเลือก 3 ชิ้น
        const shuffled = [...normalized].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, 3);

        if (!cancelled) {
          setItems(picked.length ? picked : mock.slice(0, 3));
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load");
        if (!cancelled) setItems(mock.slice(0, 3)); // ใช้ mock แทน
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [first, second, third] = useMemo(() => {
    if (items.length < 3) return [items[0], items[1], items[2]];
    return [items[0], items[1], items[2]];
  }, [items]);

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
          {/* Aura หลังอันดับ 1 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-48 w-48 md:h-64 md:w-64 rounded-full bg-pink-200/40 blur-3xl animate-pulse" />
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 h-56 w-56 md:h-72 md:w-72 rounded-full bg-purple-200/30 blur-3xl animate-[spin_16s_linear_infinite]" />
            </div>
          </div>

          {/* Rank 2 */}
          {second && (
            <PodiumCard
              item={second}
              rank={2}
              size="sm"
              className="translate-y-4 md:translate-y-6 -rotate-[0.5deg]"
              badgeBg="bg-secondary"
            />
          )}

          {/* Rank 1 */}
          {first && (
            <PodiumCard
              item={first}
              rank={1}
              size="lg"
              className="z-10 -translate-y-2 md:-translate-y-4"
              badgeBg="bg-accent"
              highlight
            />
          )}

          {/* Rank 3 */}
          {third && (
            <PodiumCard
              item={third}
              rank={3}
              size="sm"
              className="translate-y-4 md:translate-y-6 rotate-[0.5deg]"
              badgeBg="bg-muted"
            />
          )}
        </div>

        {error && (
          <p className="mt-6 text-center text-xs text-foreground/60">
            (Showing fallback while loading failed: {error})
          </p>
        )}
      </div>
    </section>
  );
}

function PodiumCard({
  item,
  rank,
  size = "sm",
  className = "",
  badgeBg = "bg-secondary",
  highlight = false,
}) {
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
      {/* ป้ายอันดับ */}
      <div className="absolute -top-3 -left-3 z-20">
        <div
          className={[
            "inline-flex items-center justify-center h-9 min-w-[88px] px-3 rounded-full",
            "border border-border/20 shadow-sm leading-none",
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

      {/* รูปสี่เหลี่ยมจัตุรัส + เงา */}
      <figure
        className={[
          "relative overflow-hidden aspect-square",
          "shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]",
          "transition-transform duration-300 will-change-transform hover:-translate-y-1",
          "rounded-none bg-transparent",
          highlight ? "ring-1 ring-primary/30" : "",
        ].join(" ")}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
      </figure>

      {/* ชื่อ + รายละเอียด (ยาวขึ้นได้) */}
      <div className="mt-3 text-center">
        <div className="inline-flex px-3 py-1 rounded-full text-xs md:text-sm font-medium text-card-foreground bg-white/80 backdrop-blur border border-border/20 shadow-sm">
          {item.title}
        </div>
        {item.desc ? (
          <div className="mt-2 text-sm text-foreground/80 line-clamp-3 px-2">
            {item.desc}
          </div>
        ) : null}
      </div>

      {/* ฐานโพเดียม */}
      <div
        className={[
          "mx-auto mt-2 h-2 rounded-full",
          isGold ? "w-3/4 bg-primary/40" : isSilver ? "w-2/3 bg-secondary/30" : "w-2/3 bg-muted/50",
        ].join(" ")}
      />
    </div>
  );
}
