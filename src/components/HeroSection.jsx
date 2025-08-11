// HeroSection.jsx
import React from "react";

export default function HeroSection() {
  const handleClick = () => {
    alert("Explore button was clicked!");
  };

  return (
    <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around py-16 px-4">
     <div className="text-center md:text-left mb-12 md:mb-0">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
          Play & Learn
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          Discover the best toys and activities to help your child grow and have fun.
        </p>
        <button
          onClick={handleClick}
         className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-105">
          Explore Now
        </button>
      </div>
      <div className="flex items-center justify-center w-64 h-64 bg-secondary rounded-full">
        <div className="text-4xl font-bold text-secondary-foreground">Baby Chub</div>
      </div>
    </section>
  );
}
