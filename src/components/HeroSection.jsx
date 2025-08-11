import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to BabyChub</h1>

        <p className="text-lg mb-6 max-w-xl mx-auto">
          Your one-stop shop for adorable baby essentials — where comfort meets
          cuteness.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/products">
            <Button className="bg-muted text-muted-foreground hover:bg-muted/80">
              Shop Now
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
