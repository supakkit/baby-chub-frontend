import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./views/Layout";
import { Home } from "./views/Home";
import { Favorite } from "./views/Favorite";
import { Cart } from "./views/Cart";
import { Checkout } from "./views/Checkout";
import { Products } from "./views/Products";
import { ProductDetail } from "./views/ProductDetail";
import { Dashboard } from "./views/Dashboard";
import { SignIn } from "./views/SignIn";
import { SignUp } from "./views/SignUp";
import { ForgotPassword } from "./views/ForgotPassword";
import { Help } from "./views/Help"; 



const router = createBrowserRouter([
    {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:productId",
        element: <ProductDetail />,
      },
      {
        path: "favorite",
        element: <Favorite />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
       {
        path: "signin",
        element: <SignIn />,
      },
       {
        path: "signup",
        element: <SignUp />,
      },
       {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
       {
        path: "help",
        element: <Help />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
