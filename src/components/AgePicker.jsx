import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AgePicker({
  title = "Shop by Age 🧐",
  subtitle = "Pick age-perfect categories",
  items = [
    { id: "3-4", label: "Age 3–4", img: "/images/ages/age-3-4.jpg" },
    { id: "4-6", label: "Age 4–6", img: "/images/ages/age-4-6.jpg" },
    { id: "6-9", label: "Age 6–9", img: "/images/ages/age-6-9.jpg" },
    { id: "9-12", label: "Age 9–12", img: "/images/ages/age-9-12.jpg" },
  ],
  defaultValue = null,          // e.g. "4-6"
  onChange,                     // (selectedItem) => void
}) {
  const [selected, setSelected] = React.useState(defaultValue);

  const handleSelect = (id) => {
    const next = id === selected ? id : id;
    setSelected(next);
    if (onChange) {
      const item = items.find((i) => i.id === next) || null;
      onChange(item);
    }
  };

  return (
    <section aria-labelledby="age-picker-heading">
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          <h2 id="age-picker-heading" className="text-xl md:text-2xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>

      <div
        role="radiogroup"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {items.map((it) => {
          const isActive = selected === it.id;
          return (
            <button
              key={it.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => handleSelect(it.id)}
              className="group text-left focus:outline-none"
            >
              <Card
                className={[
                  "overflow-hidden border transition-all duration-200",
                  isActive
                    ? "border-primary ring-2 ring-primary"
                    : "hover:border-primary/40"
                ].join(" ")}
              >
                <div className="relative">
                  {/* ใส่รูปตามวัยภายหลังได้เลย */}
                  <img
                    src={it.img}
                    alt={it.label}
                    className="h-32 w-full object-cover md:h-40"
                  />
                  {/* โทนชมพูบาง ๆ ตอนโฮเวอร์/เลือก เพื่อความคลีนและยังอยู่ในธีม */}
                  <div
                    className={[
                      "absolute inset-0 transition-colors",
                      isActive ? "bg-pink-200/20" : "group-hover:bg-pink-200/10"
                    ].join(" ")}
                  />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-medium text-foreground">
                      {it.label}
                    </span>
                    {/* จุดสถานะเล็ก ๆ */}
                    <span
                      className={[
                        "ml-2 h-2.5 w-2.5 rounded-full",
                        isActive ? "bg-primary" : "bg-border"
                      ].join(" ")}
                      aria-hidden
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tap to select
                  </p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
}
