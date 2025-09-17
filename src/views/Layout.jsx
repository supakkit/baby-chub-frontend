import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "../components/ScrollToTop";

export function Layout() {
  return (
    <ScrollToTop>
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
      <Toaster richColors position="top-center" />
    </ScrollToTop>
  );
}
