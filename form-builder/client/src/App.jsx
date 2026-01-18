import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FormBuilder from "./pages/FormBuilder/form";
import FormList from "./pages/Dashboard/FormList";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * GIẢI THÍCH APP ROUTES:
 * - Public routes: /login, /register, /
 * - Protected routes: /forms, /builder (cần đăng nhập)
 * - ProtectedRoute sẽ check isAuthenticated & redirect tới /login nếu chưa login
 * - Verify email: Tự động xử lý từ backend, redirect về /login với message
 */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}

        {/* Trang chủ */}
        <Route path="/" element={<Home />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* PROTECTED ROUTES - Cần login */}

        {/* Danh sách forms */}
        <Route
          path="/forms"
          element={<ProtectedRoute element={<FormList />} />}
        />

        {/* Form builder - tạo form mới */}
        <Route
          path="/builder/new"
          element={<ProtectedRoute element={<FormBuilder />} />}
        />

        {/* Form builder - edit form cũ (có ID) */}
        <Route
          path="/builder/:formId"
          element={<ProtectedRoute element={<FormBuilder />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
