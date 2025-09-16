import React from "react";
import Hero from "@/components/Hero";
import PromotionSlider from "@/components/PromotionSlider";
import BrowseByAge from "@/components/BrowseByAge";
import BrowseByType from "@/components/BrowseByType";
import BrowseBySubject from "@/components/BrowseBySubject";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import Partners from "@/components/Partners";
import ReviewsSection from "@/components/ReviewsSection";

export function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <PromotionSlider />

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <BrowseByAge />
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6">
        <BrowseByType />
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6">
        <BrowseBySubject />
      </section>

      <NewArrivals title="Fresh Finds for Little Minds 💖" limit={8} />

      <ReviewsSection />
      <Partners />
    </>
  );
}
