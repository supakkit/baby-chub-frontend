import React from "react";
import { NavigateToProducts } from "./NavigateToProducts";

// หมวดหมู่หลัก + อีโมจิ
const types = [
  { id: "application", label: "Application", emoji: "📱" },
  { id: "audiobook", label: "Audiobook", emoji: "🎧" },
  { id: "course", label: "Course", emoji: "🎓" },
  { id: "ebook", label: "Ebook", emoji: "📖" },
  { id: "worksheet", label: "Worksheet", emoji: "📝" },
];

export default function BrowseByType() {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="layout">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          Browse by type
        </h2>

        {/* ปุ่มแนวนอน + อีโมจิใหญ่ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {types.map((t) => (
            <NavigateToProducts key={t.id} filter={{ type: [t.id] }}>
              <span
                className={[
                  "inline-flex items-center justify-center h-12 px-5 rounded-xl w-full cursor-pointer",
                  "bg-white border border-border text-foreground font-semibold",
                  "shadow-sm hover:shadow-md hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                ].join(" ")}
              >
                <span className="text-sm md:text-base">{t.label}</span>
                <span className="ml-2 text-2xl md:text-3xl">{t.emoji}</span>
              </span>
            </NavigateToProducts>
          ))}
        </div>
      </div>
    </section>
  );
}
