// components/BrowseByAge.jsx
import React from "react";
import { NavigateToProducts } from "./NavigateToProducts";

const ageRanges = [
  { id: "3-4", label: "3-4 Years", image: "/images/age_1a.png", hoverImage: "/images/age_1b.png", min: 3, max: 4 },
  { id: "4-6", label: "4-6 Years", image: "/images/age_2a.png", hoverImage: "/images/age_2b.png", min: 4, max: 6 },
  { id: "6-9", label: "6-9 Years", image: "/images/age_3a.png", hoverImage: "/images/age_3b.png", min: 6, max: 9 },
  { id: "9-12", label: "9-12 Years", image: "/images/age_4a.png", hoverImage: "/images/age_4b.png", min: 9, max: 12 },
];

export default function BrowseByAge() {
  return (
    <section className="bg-transparent py-12 md:py-5">
      <div className="layout">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Browse by age
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 place-items-center">
          {ageRanges.map((age) => (
            <NavigateToProducts key={age.id} filter={{"age": [{min: age.min, max: age.max}]}}>
              <button
                aria-label={age.label}
                className="
                  group relative w-48 h-48 md:w-56 md:h-56
                  rounded-full overflow-hidden
                  transition-transform duration-300 ease-in-out
                  hover:scale-105
                  cursor-pointer
                "
              >
                {/* ภาพปกติ */}
                <img
                  src={age.image}
                  alt={age.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:hidden"
                  draggable={false}
                />
                {/* ภาพ hover */}
                <img
                  src={age.hoverImage}
                  alt={`${age.label} hover`}
                  className="absolute inset-0 w-full h-full object-cover hidden group-hover:block"
                  draggable={false}
                />
              </button>  
            </NavigateToProducts>
            
          ))}
        </div>
      </div>
    </section>
  );
}
