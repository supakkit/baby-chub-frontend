// HeroSection.jsx
import React from "react";

export default function HeroSection() {
  const handleClick = () => {
    alert("Explore button was clicked!");
  };

  return (
    <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around py-16 px-4">
      <div className="text-center md:text-left mb-12 md:mb-0">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-4">
          Play & Learn
        </h1>
        <p className="text-lg text-gray-600 max-w-md mb-8">
          Discover the best toys and activities to help your child grow and have
          fun.
        </p>
        <button
          onClick={handleClick}
          className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          Explore Now
        </button>
      </div>
      <div className="flex items-center justify-center w-64 h-64 bg-purple-100 rounded-full">
        <div className="text-4xl font-bold text-purple-700">Baby Chub</div>
      </div>
    </section>
  );
}
