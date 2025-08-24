import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function BestSellers() {
  // list ของที่จะโชว์ใน carousel, เดี๋ยวค่อยแก้เป็นของจริง
  const bestSellers = [
    { id: 1, title: "Toy #1", image: "/images/3Levels.png" },
    { id: 2, title: "Toy #2", image: "/images/programming-course-forest-adventure.png" },
    { id: 3, title: "Toy #3", image: "/images/money2.jpg" },
    { id: 4, title: "Toy #4", image: "/images/Daily6yr2.png" },
    { id: 5, title: "Toy #5", image: "/images/LearningTime.png" },
  ];

  return (
    // ===== BEST SELLERS SECTION =====
    <div className="relative w-screen left-1/2 -translate-x-1/2 bg-gradient-to-b from-white to-muted py-16">
      <div className="layout">
        <h2 className="text-3xl font-bold text-foreground text-center mb-2" style={{ textShadow: '1px 1px 0 #543285, -1px -1px 0 #543285, 1px -1px 0 #543285, -1px 1px 0 #4543285' }}>
          Loved by Little Learners 💖
        </h2>
        <p className="text-center text-secondary/80 mb-8">Discover the toys that are sparking joy and creativity everywhere.</p>
        
        {/* ใช้ Carousel ที่ import มา */}
        <Carousel
          opts={{ align: "start", loop: true }} // option ให้มันวนลูปได้
          className="w-full px-18" // px-18 กันขอบการ์ดโดนตัด
        >
          <CarouselContent className="-ml-4 py-4"> {/* py-4 กันการ์ഡ്โดนตัดตอนลอยขึ้น */}
            {bestSellers.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-1/2 md:basis-1/3">
                <div className="p-1">
                  <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 overflow-hidden">
                    <CardContent className="p-0 flex flex-col items-center text-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full aspect-square object-cover"
                      />
                      <p className="p-4 font-semibold text-card-foreground">
                        {item.title}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </div>
    </div>
  );
}