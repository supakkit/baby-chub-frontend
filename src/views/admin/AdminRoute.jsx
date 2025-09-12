// src/views/admin/AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function AdminRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}
