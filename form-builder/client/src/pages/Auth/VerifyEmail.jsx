import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * GIẢI THÍCH VERIFYEMAIL PAGE:
 * - User nhấn link trong email để verify account
 * - Link format: /verify-email?token=xxx&email=xxx
 * - Component sẽ tự động gọi API để verify
 * - Nếu thành công → show success message → redirect tới login
 */

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const token = searchParams.get("token");
  const urlEmail = searchParams.get("email");

  /**
   * GIẢI THÍCH useEffect:
   * - Khi component mount
   * - Nếu có token → gọi API verify
   * - Nếu không có token → show error message
   */
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("❌ Token không hợp lệ. Vui lòng check email của bạn.");
      return;
    }

    setEmail(urlEmail || "");
    verifyEmail();
  }, [token, urlEmail]);

  /**
   * GIẢI THÍCH verifyEmail:
   * - Gọi API GET /api/auth/verify/:token
   * - Backend sẽ:
   *   1. Tìm user có token này
   *   2. Check token có hết hạn không
   *   3. Set verified = true
   *   4. Xóa token
   * - Nếu thành công → show success
   */
  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/verify/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xác thực thất bại");
      }

      // Xác thực thành công
      setStatus("success");
      setMessage("✅ Xác thực email thành công! Bạn có thể đăng nhập ngay.");

      // Redirect tới login sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Lỗi:", error);
      setStatus("error");
      setMessage("❌ " + error.message);
    }
  };

  /**
   * GIẢI THÍCH handleResendEmail:
   * - Nếu token hết hạn
   * - User có thể click "Gửi lại email"
   * - Backend sẽ tạo token mới + gửi email lại
   */
  const handleResendEmail = async () => {
    if (!email) {
      setMessage("❌ Thiếu thông tin email");
      return;
    }

    try {
      setStatus("verifying");
      setMessage("⏳ Đang gửi email...");

      const response = await fetch(
        "http://localhost:3000/api/auth/resend-verify",
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
        throw new Error(data.message || "Gửi email thất bại");
      }

      setStatus("success");
      setMessage(
        "✅ Email xác thực đã được gửi lại! Vui lòng check email của bạn."
      );
    } catch (error) {
      console.error("Lỗi:", error);
      setStatus("error");
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Verifying state */}
        {status === "verifying" && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đang Xác Thực...
            </h1>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {/* Success state */}
        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Xác Thực Thành Công!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">
              Sẽ chuyển hướng tới đăng nhập trong 3 giây...
            </p>
          </>
        )}

        {/* Error state */}
        {status === "error" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Xác Thực Thất Bại
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="space-y-3">
              {email && (
                <Button
                  onClick={handleResendEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  📧 Gửi Lại Email
                </Button>
              )}
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full"
              >
                🔐 Quay Lại Đăng Nhập
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
