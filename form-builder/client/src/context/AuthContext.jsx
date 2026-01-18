import { createContext, useContext, useState, useEffect } from "react";

/**
 * GIẢI THÍCH AUTHCONTEXT:
 * - Context để lưu thông tin user đã đăng nhập
 * - Có thể access từ bất kỳ component nào
 * - Lưu: user info, token, authenticated status
 * - Khi load page: check localStorage để restore login state
 */

const AuthContext = createContext();

/**
 * GIẢI THÍCH AuthProvider:
 * - Wrapper component chứa auth state
 * - Phải wrap around <App /> trong main.jsx
 * - Cung cấp useAuth hook để access auth state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User info: { id, email }
  const [token, setToken] = useState(null); // JWT token
  const [isLoading, setIsLoading] = useState(true); // Loading khi init
  const [isAuthenticated, setIsAuthenticated] = useState(false); // true nếu đã đăng nhập

  /**
   * GIẢI THÍCH useEffect (init):
   * - Khi app load lần đầu
   * - Check localStorage có token không
   * - Nếu có → restore login state
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Lỗi khi load auth state:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  /**
   * GIẢI THÍCH login:
   * - Sau khi đăng nhập thành công
   * - Lưu token + user info
   * - Update state
   */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    // Lưu vào localStorage để persist across page reload
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * GIẢI THÍCH logout:
   * - Xóa user data
   * - Xóa localStorage
   * - Reset state
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * GIẢI THÍCH useAuth:
 * - Hook để access auth context từ component
 * - Dùng: const { user, token, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được dùng trong <AuthProvider>");
  }

  return context;
}
