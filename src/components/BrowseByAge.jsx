import React from 'react';

// ✨ 1. ข้อมูลแต่ละช่วงอายุ: แก้ไขข้อความ, ลิงก์, และสี ได้ง่ายๆ ที่นี่
const ageRanges = [
  { 
    label: '3-4 Years', 
    href: '/products?age=3-4', 
    bgColor: 'bg-sky-100', 
    textColor: 'text-sky-800',
    hoverColor: 'hover:bg-sky-200'
  },
  { 
    label: '4-6 Years', 
    href: '/products?age=4-6', 
    bgColor: 'bg-lime-100', 
    textColor: 'text-lime-800',
    hoverColor: 'hover:bg-lime-200'
  },
  { 
    label: '6-9 Years', 
    href: '/products?age=6-9', 
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-800',
    hoverColor: 'hover:bg-amber-200'
  },
  { 
    label: '9-12 Years', 
    href: '/products?age=9-12', 
    bgColor: 'bg-violet-100', 
    textColor: 'text-violet-800',
    hoverColor: 'hover:bg-violet-200'
  },
];

export default function BrowseByAge() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="layout">
        
        {/* หัวข้อ */}
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Browse by age
        </h2>

        {/* ✨ 2. Grid สำหรับวางกล่องแต่ละช่วงอายุ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {ageRanges.map((age) => (
            <a 
              key={age.label} 
              href={age.href} 
              // ✨ 3. สไตล์ของแต่ละกล่อง: ทำให้เป็นสี่เหลี่ยมจัตุรัส, มีสีพื้นหลัง, และมี Hover Effect
              className={`group flex items-center justify-center aspect-square rounded-2xl p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${age.bgColor} ${age.hoverColor}`}
            >
              <span className={`text-2xl md:text-3xl font-bold transition-transform duration-300 ease-in-out group-hover:scale-110 ${age.textColor}`}>
                {age.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}