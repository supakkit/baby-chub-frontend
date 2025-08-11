import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import { Heart, Search, User } from "lucide-react";
import React from "react";

const Nav = () => {
  const navigationItems = [
    { label: "All", href: "#" },
    { label: "New Arrival", href: "#" },
    { label: "Ages 3 - 4", href: "#" },
    { label: "Ages 4 - 6", href: "#" },
    { label: "Ages 6 - 9", href: "#" },
    { label: "Ages 9 - 12", href: "#" },
  ];

  return (
    <div className="w-full max-w-[1922px] h-[118px]">
      <div className="relative w-full max-w-[1920px] h-[118px] mx-auto">
        <div className="h-[106px] bg-backgrounf absolute w-full top-px left-0" />
        <div className="h-10 bg-variable-collection-secondary absolute w-full top-px left-0" />
        <nav className="absolute w-[989px] h-[57px] top-[49px] left-[292px] bg-white">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center h-full">
              {navigationItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={item.href}
                    className={`h-8 px-4 font-m3-headline-small font-[number:var(--m3-headline-small-font-weight)]
                      text-variable-collection-primary text-[length:var(--m3-headline-small-font-size)] text-center
                      tracking-[var(--m3-headline-small-letter-spacing)] leading-[var(--m3-headline-small-line-height)]
                      whitespace-nowrap [font-style:var(--m3-headline-small-font-style)] flex items-center justify-center
                      ${index === 0 ? "ml-0" : ""}`}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="absolute w-[223px] h-6 top-[9px] right-0">
          <Button
            variant="ghost"
            className="absolute h-8 top-[-5px] left-[22px] font-m3-headline-small-emphasized
              font-[number:var(--m3-headline-small-emphasized-font-weight)] text-backgrounf text-[length:var(--m3-headline-small-emphasized-font-size)] text-center tracking-[var(--m3-headline-small-emphasized-letter-spacing)] leading-[var(--m3-headline-small-emphasized-line-height)] whitespace-nowrap
              [font-style:var(--m3-headline-small-emphasized-font-style)] h-auto p-0"
          >
            Help
          </Button>
          <Button
            variant="ghost"
            className="absolute h-8 top-[-5px] left-[115px] font-m3-headline-small-emphasized font-[number:var(--m3-headline-small-emphasized-font-weight)] text-backgrounf text-[length:var(--m3-headline-small-emphasized-font-size)] text-center tracking-[var(--m3-headline-small-emphasized-letter-spacing)] leading-[var(--m3-headline-small-emphasized-line-height)] whitespace-nowrap [font-style:var(--m3-headline-small-emphasized-font-style)] h-auto p-0"
          >
            Sign Up
          </Button>
        </div>
        <div className="w-[90px] h-[90px] top-7 left-[116px] absolute flex items-center justify-center">
          <img
            className="w-[142px] h-[37px] object-contain"
            alt="Baby Club Logo"
            src=""
          />
        </div>
        <div className="absolute flex items-center gap-[25px] top-[59px] right-[70px]">
          <Button variant="ghost" size="icon" className="w-[30px] h-[30px] p-0">
            <Search className="w-[30px] h-[30px]" />
          </Button>
          <Button variant="ghost" size="icon" className="w-[30px] h-[30px] p-0">
            <User className="w-[30px] h-[30px]" />
          </Button>
          <Button variant="ghost" size="icon" className="w-[30px] h-[30px] p-0">
            <Heart className="w-[30px] h-[30px]" />
          </Button>
        </div>
        <div className="w-[107px] h-[107px] top-0 left-0 absolute flex items-center justify-center">
          <img
            className="w-[75px] h-[62px] object-contain"
            alt="Baby Club Icon"
            src=""
          />
        </div>
        <div className="absolute w-[365px] h-[50px] top-[49px] left-[1333px]">
          <div className="relative w-full h-[50px] bg-white rounded-[20px] shadow-[0px_2px_2px_#00000040] flex items-center">
            <div className="absolute left-[5px] w-[42px] h-[43px] flex items-center justify-center">
              <img
                className="w-[42px] h-[43px] object-contain"
                alt="Search Icon"
                src=""
              />
            </div>
            <Input
              placeholder="Search"
              className="w-full h-full border-0 bg-transparent pl-[60px] pr-4 font-m3-headline-medium font-[number:var(--m3-headline-medium-font-weight)] text-black text-[length:var(--m3-headline-medium-font-size)] tracking-[var(--m3-headline-medium-letter-spacing)] leading-[var(--m3-headline-medium-line-height)] [font-style:var(--m3-headline-medium-font-style)] placeholder:opacity-[0.36] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
