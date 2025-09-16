import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/sonner";

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
      <Toaster richColors position="Top-Center" />
    </>
  );
}
