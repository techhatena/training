import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

/**
 * GIẢI THÍCH FORGOT PASSWORD PAGE:
 * - User nhập email để yêu cầu reset password
 * - API: POST /api/auth/forgot-password
 * - Backend gửi email với reset link
 * - Email chứa URL: /reset-password/:token
 * - Token có thời hạn (15-30 phút)
 */

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * GIẢI THÍCH handleSubmit:
   * - Validate email format
   * - Call API: POST /api/auth/forgot-password
   * - Show success message
   * - Tell user to check email
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate email
    if (!email) {
      setError("❌ Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("❌ Email không hợp lệ");
      return;
    }

    try {
      setIsLoading(true);

      // Call API
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "❌ Lỗi khi gửi yêu cầu reset");
        return;
      }

      // Success - show message to check email
      setMessage(
        `✅ Email reset password đã được gửi tới ${email}\n📧 Vui lòng check email và click link để reset password`
      );

      // Clear email input
      setEmail("");

      // Auto redirect sau 5 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Lỗi:", err);
      setError("❌ Lỗi kết nối: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quên Mật Khẩu</h1>
          <p className="text-gray-600 text-sm mt-2">
            Nhập email của bạn để nhận link reset password
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm whitespace-pre-line">
              {message}
            </p>
            <p className="text-green-600 text-xs mt-2">
              ⏱️ Sẽ chuyển hướng về login trong 5 giây...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
            >
              {isLoading ? "Đang gửi..." : "Gửi Link Reset"}
            </Button>
          </form>
        )}

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Nhớ mật khẩu rồi?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
