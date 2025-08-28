import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";

export function Layout() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
      
      <CookieBanner />
    </>
  );
}