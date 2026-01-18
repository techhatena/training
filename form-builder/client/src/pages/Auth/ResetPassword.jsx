import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate, Link } from "react-router-dom";

/**
 * GIẢI THÍCH RESET PASSWORD PAGE:
 * - User click link từ email: /reset-password/:token
 * - Page tự động verify token
 * - Nếu token valid: show form nhập password mới
 * - Nếu token invalid/expired: show error message
 * - API: POST /api/auth/reset-password/:token
 */

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * GIẢI THÍCH useEffect - Verify Token:
   * - Khi page load: check token có valid không
   * - Backend kiểm tra token exists và chưa expired
   * - Token format: eyJhbGc... (JWT)
   * - Hết hạn sau 15-30 phút
   */
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      setIsVerifying(true);
      setError("");

      // Verify token bằng cách gọi API
      // Backend sẽ check token exists và valid
      const response = await fetch(
        `http://localhost:3000/api/auth/verify-reset-token/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(
          data.message || "❌ Link reset không hợp lệ hoặc đã hết hạn (15 phút)"
        );
        setIsValidToken(false);
        return;
      }

      // Token valid
      setIsValidToken(true);
    } catch (err) {
      console.error("Lỗi:", err);
      setError("❌ Lỗi khi xác thực token: " + err.message);
      setIsValidToken(false);
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * GIẢI THÍCH handleSubmit:
   * - Validate password
   * - Call API: POST /api/auth/reset-password/:token
   * - Send new password
   * - Redirect to login sau khi success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate
    if (!password || !confirmPassword) {
      setError("❌ Vui lòng nhập mật khẩu");
      return;
    }

    if (password.length < 6) {
      setError("❌ Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ Mật khẩu không trùng nhau");
      return;
    }

    try {
      setIsResetting(true);

      // Call API reset password
      const response = await fetch(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "❌ Lỗi khi reset password");
        return;
      }

      // Success
      setMessage(
        "✅ Mật khẩu đã được reset thành công!\n🎉 Bạn có thể đăng nhập với mật khẩu mới"
      );

      // Clear inputs
      setPassword("");
      setConfirmPassword("");

      // Redirect to login sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Lỗi:", err);
      setError("❌ Lỗi kết nối: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">⏳ Đang xác thực link reset...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ❌ Link Không Hợp Lệ
            </h1>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>

          <p className="text-gray-600 text-sm text-center mb-4">
            Link reset password đã hết hạn hoặc không tồn tại.
          </p>

          <Link to="/forgot-password">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              📧 Yêu Cầu Link Mới
            </Button>
          </Link>

          <p className="text-sm text-gray-600 text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Về trang đăng nhập
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reset Mật Khẩu</h1>
          <p className="text-gray-600 text-sm mt-2">
            Nhập mật khẩu mới của bạn
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm whitespace-pre-line">
              {message}
            </p>
            <p className="text-green-600 text-xs mt-2">
              ⏱️ Sẽ chuyển hướng về login trong 3 giây...
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
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="w-full"
                disabled={isResetting}
              />
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu..."
                className="w-full"
                disabled={isResetting}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isResetting || !password || !confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
            >
              {isResetting ? "Đang reset..." : "Reset Mật Khẩu"}
            </Button>
          </form>
        )}

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Về trang đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
