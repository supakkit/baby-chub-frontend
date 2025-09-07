// components/BrowseByAge.jsx
import React from "react";

const ageRanges = [
  { id: "3-4", label: "3-4 Years", image: "/images/age_1a.png", hoverImage: "/images/age_1b.png" },
  { id: "4-6", label: "4-6 Years", image: "/images/age_2a.png", hoverImage: "/images/age_2b.png" },
  { id: "6-9", label: "6-9 Years", image: "/images/age_3a.png", hoverImage: "/images/age_3b.png" },
  { id: "9-12", label: "9-12 Years", image: "/images/age_4a.png", hoverImage: "/images/age_4b.png" },
];

export default function BrowseByAge({ onSelect }) {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="layout">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Browse by age
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 place-items-center">
          {ageRanges.map((age) => (
            <button
              key={age.id}
              onClick={() => onSelect?.(age.id)}
              aria-label={age.label}
              className="group relative w-48 h-48 md:w-56 md:h-56 rounded-full shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              {/* ภาพปกติ */}
              <img
                src={age.image}
                alt={age.label}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                draggable={false}
              />
              {/* ภาพ hover */}
              <img
                src={age.hoverImage}
                alt={`${age.label} hover`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
