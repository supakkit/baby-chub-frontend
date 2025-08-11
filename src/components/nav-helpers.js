// src/components/nav-helpers.js
export const NAV_ITEMS = [
  { label: "All", view: "products", active: true },
  { label: "New Arrival", view: "new", active: false },
  { label: "Ages 3 - 4", view: "ages-3-4", active: false },
  { label: "Ages 4 - 6", view: "ages-4-6", active: false },
  { label: "Ages 6 - 9", view: "ages-6-9", active: false },
  { label: "Ages 9 - 12", view: "ages-9-12", active: false },
];

export const HEADER_ACTIONS = [
  { label: "Help", href: "#help" },
  { label: "Sign Up", href: "#signup" },
];

export const ICON_BUTTONS = [
  { src: "/images/heart.svg", alt: "favorite", action: "favorite" },
  { src: "/images/person.svg", alt: "profile", action: "profile" },
  { src: "/images/cart.svg", alt: "cart", action: "cart" },
];
