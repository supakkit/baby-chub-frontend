import React from "react";

export function NavigationMenu({ children }) {
  return <nav>{children}</nav>;
}

export function NavigationMenuList({ children, className }) {
  return <ul className={className}>{children}</ul>;
}

export function NavigationMenuItem({ children }) {
  return <li>{children}</li>;
}

export function NavigationMenuLink({ href, className, children }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
