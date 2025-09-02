// src/views/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function ProtectedRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  // ผ่านเมื่อมี user.id
  const isAuthed = !!user?.id;

  // ถ้ายังไม่ล็อกอิน → ไป /signin และจำเส้นทางเดิมไว้
  return isAuthed ? (
    children
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
}
