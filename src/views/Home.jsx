import React from "react";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

export function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <Partners />
    </>
  );
}