import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export function Layout() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
