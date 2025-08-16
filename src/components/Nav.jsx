// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import searchIcon from "/images/search.svg";
// import logo from "/images/logotextvertical.svg";
// import userIcon from "/images/person.svg";
// import cartIcon from "/images/cart.svg";
// import favoriteIcon from "/images/heart.svg";

// function Nav() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   const NAV_ITEMS = [
//     {
//       label: "All",
//       path: "/products",
//       dropdown: [
//         { label: "Ages 3 - 4", path: "/all/ages-3-4" },
//         { label: "Ages 4 - 6", path: "/all/ages-4-6" },
//         { label: "Ages 6 - 9", path: "/all/ages-6-9" },
//         { label: "Ages 9 - 12", path: "/all/ages-9-12" },
//       ],
//     },
//     { label: "About", path: "/about" },
//     { label: "New Arrival", path: "/new" },
//   ];

//   const HEADER_ACTIONS = [
//     { label: "Help", path: "/help" },
//     { label: "Sign Up", path: "/sign-up" },
//   ];

//   return (
//     <header className="text-foreground shadow-sm">
//       {/* Top thin bar (#543285) */}
//       <div className="w-full bg-[#543285] text-slate-50">
//         <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center justify-end gap-4 text-lg">
//           {HEADER_ACTIONS.map((a) => (
//             <Link
//               key={a.label}
//               to={a.path}
//               className="relative top-0 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--variable-collection-primary)]"
//             >
//               {a.label}
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Main nav row */}
//       <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8">
//         <div className="flex items-center justify-between gap-1 py-4 md:py-5">
//           {/* Left logos */}
//           <Link
//             to="/"
//             className="flex items-center gap-3 cursor-pointer"
//             aria-label="Go to home"
//           >
//             <img src={logo} alt="Baby Chub Brand" className="h-18 w-auto" />
//           </Link>

//           {/* Desktop navigation items (center) */}
//           <nav
//             className="hidden lg:flex items-center gap-8"
//             aria-label="Product categories"
//             onMouseLeave={() => setDropdownOpen(false)}
//           >
//             {NAV_ITEMS.map((item) => (
//               <div
//                 key={item.label}
//                 className="relative"
//                 onMouseEnter={() => item.dropdown && setDropdownOpen(true)}
//               >
//                 <Link
//                   to={item.path}
//                   className="relative text-lg font-bold whitespace-nowrap text-[color:var(--foreground)] hover:text-[color:var(--variable-collection-primary)] transition"
//                 >
//                   {item.label}
//                 </Link>

//                 {/* Dropdown */}
//                 {item.dropdown && dropdownOpen && (
//                   <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
//                     <ul className="py-1">
//                       {item.dropdown.map((sub) => (
//                         <li key={sub.label}>
//                           <Link
//                             to={sub.path}
//                             className="block px-4 py-2 text-shadow-md : text-gray-700 hover:bg-gray-100"
//                             onClick={() => setDropdownOpen(false)}
//                           >
//                             {sub.label}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>

//           {/* Right side: Search, favorite, profile, cart icons */}
//           <div className="hidden md:flex items-center gap-4">
//             {/* Search box */}
//             <div className="flex items-center bg-white rounded-[20px] shadow-[0_2px_2px_rgba(0,0,0,0.25)] px-3 py-2">
//               <button
//                 type="submit"
//                 aria-label="Search"
//                 className="mr-2"
//                 onClick={() => alert(`Searching for: ${searchValue}`)}
//               >
//                 <img src={searchIcon} alt="search icon" className="w-8 h-8" />
//               </button>
//               <input
//                 type="search"
//                 placeholder="Search"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 className="w-44 md:w-60 lg:w-72 text-sm placeholder:opacity-60 outline-none bg-transparent"
//               />
//             </div>

//             {/* Icon buttons */}
//             <Link
//               to="/favorite"
//               aria-label="favorite"
//               className="w-9 h-9 rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
//             >
//               <img
//                 src={favoriteIcon}
//                 alt="favorite"
//                 className="w-full h-full object-contain"
//               />
//             </Link>

//             <Link
//               to="/profile"
//               aria-label="profile"
//               className="w-9 h-9 rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
//             >
//               <img
//                 src={userIcon}
//                 alt="profile"
//                 className="w-full h-full object-contain"
//               />
//             </Link>

//             <Link
//               to="/cart"
//               aria-label="cart"
//               className="w-9 h-9 rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)] relative"
//             >
//               <img
//                 src={cartIcon}
//                 alt="cart"
//                 className="w-full h-full object-contain"
//               />
//               {/* Badge */}
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
//                 0
//               </span>
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden inline-flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--variable-collection-primary)]"
//             onClick={() => setMenuOpen((s) => !s)}
//             aria-expanded={menuOpen}
//             aria-label="Toggle menu"
//           >
//             <svg
//               className="w-6 h-6"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//             >
//               {menuOpen ? (
//                 <path
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               ) : (
//                 <path
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Mobile dropdown menu */}
//         {menuOpen && (
//           <nav className="md:hidden bg-background px-4 pb-6 pt-3 shadow-md rounded-b-md">
//             <ul className="flex flex-col gap-3">
//               {NAV_ITEMS.map((item) => (
//                 <li key={item.label}>
//                   <Link
//                     to={item.path}
//                     className="block py-2 px-3 rounded hover:bg-[color:var(--variable-collection-primary)] hover:text-white transition"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     {item.label}
//                   </Link>
//                   {/* Mobile dropdown for All submenu */}
//                   {item.dropdown && (
//                     <ul className="ml-4 mt-1 flex flex-col gap-1">
//                       {item.dropdown.map((sub) => (
//                         <li key={sub.label}>
//                           <Link
//                             to={sub.path}
//                             className="block py-1 px-3 rounded hover:bg-[color:var(--variable-collection-primary)] hover:text-white transition text-sm"
//                             onClick={() => setMenuOpen(false)}
//                           >
//                             {sub.label}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//               {/* Header actions mobile */}
//               {HEADER_ACTIONS.map((a) => (
//                 <li key={a.label}>
//                   <Link
//                     to={a.path}
//                     className="block py-2 px-3 rounded hover:bg-[color:var(--variable-collection-primary)] hover:text-white transition"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     {a.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// }

// export default Nav;


import React, { useState } from "react";
import { Link } from "react-router-dom";

// ❌ ลบการ import รูปออก เพราะไฟล์อยู่ใน public/
// import searchIcon from "/images/search.svg";
// import logo from "/images/logotextvertical.svg";
// import userIcon from "/images/person.svg";
// import cartIcon from "/images/cart.svg";
// import favoriteIcon from "/images/heart.svg";

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const NAV_ITEMS = [
    {
      label: "All",
      path: "/products",
      dropdown: [
        { label: "Ages 3 - 4", path: "/all/ages-3-4" },
        { label: "Ages 4 - 6", path: "/all/ages-4-6" },
        { label: "Ages 6 - 9", path: "/all/ages-6-9" },
        { label: "Ages 9 - 12", path: "/all/ages-9-12" },
      ],
    },
    { label: "About Us", path: "/about-us" },
    { label: "New Arrival", path: "/new" },
  ];

  const HEADER_ACTIONS = [
    { label: "Sign In", path: "/signin" },
    { label: "Sign Up", path: "/signup" },
    { label: "Help", path: "/help" },
  ];

  return (
    <header className="text-foreground shadow-sm">
      {/* Top thin bar (#543285) */}
      <div className="w-full bg-[#543285] text-slate-50">
        <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center justify-end gap-4 text-lg">
          {HEADER_ACTIONS.map((a) => (
            <Link key={a.label} to={a.path} className="hover:opacity-90">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 py-4 md:py-5">
          {/* Left logos */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer" aria-label="Go to home">
            {/* ✅ เปลี่ยนเป็น src="/images/..." */}
            <img src="/images/logotextvertical.svg" alt="Baby Chub Brand" className="h-18 w-auto" />
          </Link>

          {/* Desktop navigation items */}
          <nav className="hidden lg:flex items-center gap-8" onMouseLeave={() => setDropdownOpen(false)}>
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => item.dropdown && setDropdownOpen(true)}>
                <Link
                  to={item.path}
                  className="text-lg font-bold whitespace-nowrap text-[color:var(--foreground)] hover:text-[color:var(--variable-collection-primary)]"
                >
                  {item.label}
                </Link>

                {item.dropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-white shadow-lg z-50">
                    <ul className="py-1">
                      {item.dropdown.map((sub) => (
                        <li key={sub.label}>
                          <Link to={sub.path} className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search box */}
            <div className="flex items-center bg-white rounded-[20px] shadow px-3 py-2">
              <button type="submit" className="mr-2" onClick={() => alert(`Searching for: ${searchValue}`)}>
                {/* ✅ เปลี่ยนเป็น src="/images/..." */}
                <img src="/images/search.svg" alt="search icon" className="w-8 h-8" />
              </button>
              <input
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-44 md:w-60 lg:w-72 text-sm placeholder:opacity-60 outline-none bg-transparent"
              />
            </div>

            {/* Favorite */}
            <Link to="/favorite" className="w-9 h-9">
              {/* ✅ เปลี่ยนเป็น src="/images/..." */}
              <img src="/images/heart.svg" alt="favorite" className="w-full h-full object-contain" />
            </Link>

            {/* Profile */}
            <Link to="/profile" className="w-9 h-9">
              {/* ✅ เปลี่ยนเป็น src="/images/..." */}
              <img src="/images/person.svg" alt="profile" className="w-full h-full object-contain" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="w-9 h-9 relative">
              {/* ✅ เปลี่ยนเป็น src="/images/..." */}
              <img src="/images/cart.svg" alt="cart" className="w-full h-full object-contain" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">0</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Nav;
