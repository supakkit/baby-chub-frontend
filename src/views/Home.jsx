import React from "react";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import Partners from "@/components/Partners";

export function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <Partners />
    </>
  );
}