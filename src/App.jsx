import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./views/Layout";
import { Home } from "lucide-react";



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
    ]
  }
]);



export default function App() {
  return <RouterProvider router={router} />
}
