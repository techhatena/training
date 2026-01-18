import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

/**
 * GIẢI THÍCH LOGIN PAGE:
 * - Form đăng nhập (email, password)
 * - Gọi API POST /api/auth/login
 * - Backend trả về JWT token
 * - Lưu token + user info vào context
 * - Redirect tới /forms
 */

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Kiểm tra message từ verify email redirect
  useEffect(() => {
    const verified = searchParams.get("verified");
    const msg = searchParams.get("message");

    if (verified === "true") {
      setMessage("✅ " + (msg || "Xác thực thành công! Vui lòng đăng nhập"));
    } else if (verified === "false") {
      setMessage("❌ " + (msg || "Xác thực thất bại"));
    }
  }, [searchParams]);

  /**
   * GIẢI THÍCH handleChange:
   * - Update form data
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * GIẢI THÍCH validate:
   * - Check email & password không bỏ trống
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email không được bỏ trống";
    }

    if (!formData.password) {
      newErrors.password = "Password không được bỏ trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * GIẢI THÍCH handleSubmit:
   * - Validate form
   * - Gọi API POST /api/auth/login
   * - Backend kiểm tra email & password
   * - Trả về { user, token }
   * - Lưu vào context + localStorage
   * - Redirect tới /forms
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3000/api/auth/login", {
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
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Đăng nhập thành công
      const { user, token } = data;

      // Lưu vào context
      login(user, token);

      setMessage("✅ Đăng nhập thành công!");

      // Redirect tới /forms
      setTimeout(() => {
        navigate("/forms");
      }, 1000);
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
          Đăng Nhập
        </h1>
        <p className="text-gray-600 text-center mb-6">Đăng nhập để tiếp tục</p>

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

          {/* Forgot password link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
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
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
        </form>

        {/* Link to register */}
        <p className="text-center text-gray-600 text-sm mt-4">
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
  );
}
