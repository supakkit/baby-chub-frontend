import React from "react";
import HeroSection from "../components/ui/HeroSection";
// import BestSellers from "../components/BestSellers";
// import FeaturedContent from "../components/FeaturedContent";
// import AgeBrowser from "../components/AgeBrowser";
// import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-10 lg:gap-16">
        <HeroSection />
        {/* <BestSellers />
        <FeaturedContent />
        <AgeBrowser />
        <Footer /> */}
      </div>
    </>
  );
}
