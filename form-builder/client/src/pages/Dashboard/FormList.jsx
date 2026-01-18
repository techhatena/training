import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImportModal from "@/components/ImportModal";
import { useAuth } from "@/context/AuthContext";

/**
 * GIẢI THÍCH FORMLIST PAGE:
 * - Page hiển thị danh sách tất cả forms của user
 * - Có search để tìm form theo tên
 * - Có button Edit để chỉnh sửa form
 * - Có button Delete để xóa form
 * - Có button Import để upload file .json
 * - Khi load page: fetch danh sách forms từ backend
 */

export default function FormList() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Lấy user info từ context
  const [forms, setForms] = useState([]); // Danh sách forms
  const [filteredForms, setFilteredForms] = useState([]); // Forms sau khi search
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị search
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Import modal state

  /**
   * GIẢI THÍCH useEffect:
   * - Khi component mount: fetch danh sách forms từ backend
   * - API endpoint: GET /api/forms
   * - Cần gửi token trong header để xác thực
   */
  useEffect(() => {
    fetchForms();
  }, []);

  /**
   * GIẢI THÍCH fetchForms:
   * - Gọi API backend để lấy danh sách forms của user hiện tại
   * - Backend sẽ trả về array của forms
   * - Lưu vào state forms
   */
  const fetchForms = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Lấy token từ localStorage (được lưu khi đăng nhập)
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Chưa đăng nhập. Vui lòng đăng nhập trước!");
        navigate("/login");
        return;
      }

      // Gọi API backend
      const response = await fetch("http://localhost:3000/api/forms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
      });

      // Kiểm tra response
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login"); // Token hết hạn, về login
          return;
        }
        // Nếu lỗi 500, set empty forms thay vì error
        setForms([]);
        setFilteredForms([]);
        setError(""); // Xóa error message
        return;
      }

      const data = await response.json();
      setForms(data || []); // Lưu danh sách forms
      setFilteredForms(data || []); // Hiển thị tất cả lúc đầu
      setError(""); // Xóa error message nếu success
    } catch (err) {
      console.error("Lỗi:", err);
      setForms([]); // Set empty forms
      setFilteredForms([]);
      setError(""); // Không hiển thị error, chỉ hiển thị "Không có form"
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * GIẢI THÍCH handleSearch:
   * - Khi user nhập vào search input
   * - Filter danh sách forms theo tên
   * - So sánh không case-sensitive
   */
  const handleSearch = (value) => {
    setSearchTerm(value);

    // Filter forms theo từ khóa
    const filtered = forms.filter((form) =>
      form.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  /**
   * GIẢI THÍCH handleEdit:
   * - Khi user click "Sửa" -> đưa user vào form builder
   * - Truyền formId vào URL để builder load form cũ
   * - URL: /builder/:formId
   */
  const handleEdit = (formId) => {
    navigate(`/builder/${formId}`);
  };

  /**
   * GIẢI THÍCH handleDelete:
   * - Xóa form từ database
   * - Gọi API DELETE /api/forms/:id
   * - Sau khi xóa: làm mới danh sách
   */
  const handleDelete = async (formId) => {
    // Confirm trước khi xóa
    if (!window.confirm("Bạn chắc chắn muốn xóa form này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Gọi API xóa form
      const response = await fetch(
        `http://localhost:3000/api/forms/${formId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xóa form");
      }

      // Xóa thành công: làm mới danh sách
      setForms(forms.filter((f) => f._id !== formId));
      setFilteredForms(filteredForms.filter((f) => f._id !== formId));
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Lỗi khi xóa form: " + err.message);
    }
  };

  /**
   * GIẢI THÍCH handleImport:
   * - User chọn file .json trong ImportModal
   * - Import data: tạo form mới với structure từ file
   * - Gọi API POST /api/forms với data từ file
   */
  const handleImport = async (importData) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: importData.name, // Lấy tên từ file
        schema: importData.structure, // Lấy structure từ file
      };

      // Tạo form mới từ import data
      const response = await fetch("http://localhost:3000/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi import form");
      }

      const newForm = await response.json();

      // Thêm form mới vào danh sách
      setForms([newForm, ...forms]);
      setFilteredForms([newForm, ...filteredForms]);

      alert("✅ Import form thành công!");
    } catch (err) {
      console.error("Lỗi:", err);
      alert("❌ Lỗi khi import form: " + err.message);
    }
  };

  /**
   * GIẢI THÍCH handleCreateNew:
   * - Khi user click "Tạo form mới"
   * - Đưa user tới form builder (không có formId = form mới)
   */
  const handleCreateNew = () => {
    navigate("/builder/new");
  };

  /**
   * GIẢI THÍCH handleLogout:
   * - Gọi logout từ useAuth() - xóa user, token khỏi context & localStorage
   * - Chuyển hướng về trang login
   */
  const handleLogout = () => {
    logout(); // Xóa auth state
    navigate("/login"); // Về login
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Forms
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Tạo, chỉnh sửa, hoặc xóa forms
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {/* User email */}
            {user && (
              <p className="text-xs sm:text-sm text-gray-600">
                👤 <span className="font-semibold">{user.email}</span>
              </p>
            )}
            {/* Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm flex-1 sm:flex-none"
              >
                ➕ New
              </Button>
              <Button
                onClick={() => setIsImportModalOpen(true)}
                variant="outline"
                className="text-gray-700 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                📂 Import
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                🚪 Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <Input
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 Tìm form..."
          className="max-w-full sm:max-w-md text-xs sm:text-sm"
        />
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 py-4 sm:py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">⏳ Đang tải...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
            <p>❌ {error}</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
            <p className="text-gray-600 text-base sm:text-lg">Chưa có form</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Tạo form mới để bắt đầu
            </p>
            <Button
              onClick={handleCreateNew}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Create
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredForms.map((form) => (
              <div
                key={form._id}
                className="bg-white rounded-lg border p-3 sm:p-4 hover:shadow-lg transition"
              >
                {/* Form name */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {form.title}
                </h3>

                {/* Form info */}
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>
                    📅 {new Date(form.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <p>{new Date(form.updatedAt).toLocaleDateString("vi-VN")}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 sm:mt-4">
                  <Button
                    onClick={() => handleEdit(form._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm p-2 sm:p-3"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(form._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm p-2 sm:p-3"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IMPORT MODAL */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
