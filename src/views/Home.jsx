import React from "react";
import Hero from "@/components/Hero";
import AgePicker from "@/components/AgePicker";
import FeaturedSlider from "@/components/FeaturedSlider";
import BestSellers from "@/components/BestSellers";
import Partners from "@/components/Partners";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export function Home() {
  const ageItems = [
    { id: "3-4", label: "Age 3–4", img: "/images/ages/age-3-4.jpg" },
    { id: "4-6", label: "Age 4–6", img: "/images/ages/age-4-6.jpg" },
    { id: "6-9", label: "Age 6–9", img: "/images/ages/age-6-9.jpg" },
    { id: "9-12", label: "Age 9–12", img: "/images/ages/age-9-12.jpg" },
  ];

  const [selectedAge, setSelectedAge] = React.useState(null);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <AgePicker
          items={ageItems}
          defaultValue={null}
          onChange={(item) => setSelectedAge(item?.id ?? null)}
        />
      </section>

      <FeaturedSlider title="Fresh Finds for Little Minds 💖" limit={8} />

      <BestSellers />

      <ReviewsSection />

      <Partners />

    </>
  );
}
