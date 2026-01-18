import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * GIẢI THÍCH PROTECTEDROUTE:
 * - Component để bảo vệ routes (chỉ user đã login mới vào được)
 * - Nếu chưa login → redirect tới /login
 * - Nếu đã login → render component
 * - Dùng: <ProtectedRoute element={<FormList />} />
 */

export default function ProtectedRoute({ element }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Đang load auth state (check localStorage)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  // Chưa login → redirect tới login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã login → render component
  return element;
}
