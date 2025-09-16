import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./views/Layout";
import { Home } from "./views/Home";
import { Favorite } from "./views/Favorite";
import { Cart } from "./views/Cart";
import { Checkout } from "./views/Checkout";
import { Products } from "./views/Products";
import { ProductDetail } from "./views/ProductDetail";
import { SignIn } from "./views/SignIn";
import { SignUp } from "./views/SignUp";
import { ForgotPassword } from "./views/ForgotPassword";
import { PendingPayment } from "./views/PendingPayment";
import { OrderConfirmation } from "./views/OrderConfirmation";
import { Help } from "./views/Help";
import { UserProfile } from "./views/UserProfile";
import { ProtectedRoute } from "./views/ProtectedRoute";
import About from "./views/About";
import { OrderDetail } from "./views/OrderDetail";
import { Library } from "./views/Library";
import HowItWorks from "./views/HowItWorks";
import NotFound from "./views/NotFound";
import AdminRoute from "./views/admin/AdminRoute";
import AdminLayout from "./views/admin/AdminLayout";
import AdminDashboard from "./views/admin/AdminDashboard";
import AdminUsers from "./views/admin/AdminUsers";
import AdminOrders from "./views/admin/AdminOrders";
import { ResetPassword } from "./views/ResetPassword";
import { AdminProduct } from "./views/admin/AdminProducts";

const NewArrival = () => <div className="p-6">New Arrival – coming soon</div>;
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
        path: "pending-payment",
        element: <PendingPayment />,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "new",
        element: <NewArrival />,
      },
      {
        path: "library",
        element: <Library />,
      },
      { path: "how-it-works", element: <HowItWorks /> },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "products", element: <AdminProduct /> },
        ],
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
