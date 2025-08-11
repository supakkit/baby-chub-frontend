import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./views/Layout";
import { Home } from "./views/Home";
import { Favorite } from "./views/Favorite";
import { Cart } from "./views/Cart";
import { Checkout } from "./views/Checkout";


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
    ],
  },
]);

export default function App() {
    
  return <RouterProvider router={router} />
}
