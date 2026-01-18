import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

/**
 * GIẢI THÍCH HOME PAGE:
 * - Trang chủ của ứng dụng
 * - Có button "Danh sách Forms" để xem tất cả forms
 * - Có button "Tạo Form Mới" để tạo form mới
 */

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 py-2">
                  {user?.email}
                </span>
                <Button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Đăng Xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="text-gray-700"
                >
                  Đăng Nhập
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Đăng Ký
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-gray-900">
            Tạo Forms Đẹp Một Cách Dễ Dàng
          </h2>
          <p className="text-xl text-gray-600">
            Drag & drop các phần tử để tạo form theo ý muốn, không cần code
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/builder/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              ➕ Tạo Form Mới
            </Button>
            <Button
              onClick={() => navigate("/forms")}
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              📂 Xem Danh Sách Forms
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900">Dễ Sử Dụng</h3>
            <p className="text-gray-600 mt-2">
              Giao diện drag & drop trực quan, dễ sử dụng cho mọi người
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="text-xl font-semibold text-gray-900">Lưu Trữ</h3>
            <p className="text-gray-600 mt-2">
              Lưu forms vào database, dễ dàng quản lý và chỉnh sửa
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900">Nhanh Chóng</h3>
            <p className="text-gray-600 mt-2">
              Tạo forms chỉ trong vài phút, không cần chờ đợi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
