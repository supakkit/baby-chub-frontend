import React from "react";

// รายการหมวดวิชา + อีโมจิ
const subjects = [
  { id: "coding", label: "Coding", emoji: "💻" },
  { id: "math", label: "Math", emoji: "➗" },
  { id: "language", label: "Language", emoji: "🗣️" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "english", label: "English", emoji: "📚" },
  { id: "life-skill", label: "Life Skill", emoji: "🌱" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "others", label: "Others", emoji: "✨" },
];

export default function BrowseBySubject() {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="layout">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          Browse by subject
        </h2>

        {/* ปุ่มแนวนอน + อีโมจิท้ายข้อความ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {subjects.map((s) => (
            <a
              key={s.id}
              href={`/products?subject=${s.id}`}
              className={[
                "inline-flex items-center justify-center h-11 px-4 md:h-12 md:px-5 rounded-xl",
                "bg-white border border-border text-foreground font-semibold",
                "shadow-sm hover:shadow-md hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              ].join(" ")}
            >
              <span className="text-sm md:text-base">{s.label}</span>
              <span className="ml-2 text-2xl md:text-3xl">{s.emoji}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
