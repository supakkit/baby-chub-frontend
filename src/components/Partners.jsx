import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const partnersData = [
  { id: 1, name: 'Get-Through Confused', logoUrl: '/images/grouplogo (1).png' },
  { id: 2, name: 'Tiramisu Susu', logoUrl: '/images/grouplogo (2).png' },
  { id: 3, name: 'TokyoDIY', logoUrl: '/images/grouplogo (3).png' },
  { id: 4, name: 'Furious Pansib', logoUrl: '/images/grouplogo (4).png' },
  { id: 5, name: 'Nid Wow Shrimp Crackers', logoUrl: '/images/grouplogo (5).png' },
  { id: 6, name: 'Psycho Bread', logoUrl: '/images/grouplogo (6).png' },
  { id: 7, name: 'Don\'t Mess With Takoh', logoUrl: '/images/grouplogo (7).png' },
];

export default function Partners() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="layout">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Our partners
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          loop={true}
          speed={1500}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {partnersData.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div className="block">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-24 md:h-40 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 mx-auto"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

                <div className="flex justify-center mb-16">
          <a href="https://thailand.generation.org/" className="block">
            <img
              src="/images/Generation_Thailand_logo.png"
              alt="Generation Thailand Logo"
              className="h-20 object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
            />
          </a>
        </div>
      </div>
    </section>
  );
}