import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

/**
 * GIẢI THÍCH REGISTER PAGE:
 * - Form đăng ký (email, password, confirm password)
 * - Validation: email valid, password match
 * - Gọi API POST /api/auth/register
 * - Nếu thành công → redirect tới verify email page
 */

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Kiểm tra message từ verify email redirect
  useEffect(() => {
    const verified = searchParams.get("verified");
    const msg = searchParams.get("message");

    if (verified === "true") {
      setMessage(
        "✅ " + (msg || "Xác thực thành công! Bạn có thể đăng nhập ngay")
      );
    } else if (verified === "false") {
      setMessage("❌ " + (msg || "Xác thực thất bại"));
    }
  }, [searchParams]);

  /**
   * GIẢI THÍCH handleChange:
   * - Update form data khi user nhập
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa error của field này khi user bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * GIẢI THÍCH validate:
   * - Kiểm tra email valid
   * - Kiểm tra password >= 6 ký tự
   * - Kiểm tra password match
   */
  const validate = () => {
    const newErrors = {};

    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Check password
    if (!formData.password) {
      newErrors.password = "Password không được bỏ trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password phải >= 6 ký tự";
    }

    // Check confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * GIẢI THÍCH handleSubmit:
   * - Validate form
   * - Gọi API POST /api/auth/register
   * - Backend sẽ gửi mail xác thực
   * - Redirect tới verify email page
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Đăng ký thành công → hiển thị message
      setMessage("✅ Đăng ký thành công! Vui lòng check email để xác thực.");

      // Reset form
      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage("❌ " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Đăng Ký
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Tạo tài khoản để bắt đầu
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password input */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className={errors.password ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm password input */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Xác Nhận Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              className={errors.confirmPassword ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded text-sm ${
                message.includes("✅")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
          </Button>
        </form>

        {/* Link to login */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
