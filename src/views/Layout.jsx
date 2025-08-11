import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import CookieBanner from "../components/CookieBanner";

export function Layout() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      <CookieBanner />
    </>
  );
}
