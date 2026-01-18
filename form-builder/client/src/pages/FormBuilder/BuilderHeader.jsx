import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useEditor } from "@craftjs/core";
import { useState, useEffect } from "react";
import FormPreview from "./FormPreview";
import { useAuth } from "@/context/AuthContext";

/**
 * GIẢI THÍCH BUILDER HEADER:
 * - Đây là header của form builder (trên cùng)
 * - Support cả CREATE (form mới) và EDIT (form cũ)
 * - formId prop: nếu có = edit mode, không có = create mode
 */

export default function BuilderHeader({ formId, initialFormName }) {
  const { query } = useEditor();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formName, setFormName] = useState(initialFormName || "Form không tên");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Update formName khi initialFormName thay đổi
  useEffect(() => {
    if (initialFormName) {
      setFormName(initialFormName);
    }
  }, [initialFormName]);

  /**
   * GIẢI THÍCH handleExport:
   * - Lấy toàn bộ form structure (query.serialize())
   * - Tạo JSON object: { name, structure, exportedAt }
   * - Download thành file: form-name.json
   */
  const handleExport = () => {
    try {
      const formJson = query.serialize();

      // Tạo object export
      const exportData = {
        name: formName,
        structure: formJson,
        exportedAt: new Date().toISOString(),
        version: "1.0", // Version form builder
      };

      // Convert object → JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Tạo Blob (file)
      const blob = new Blob([jsonString], { type: "application/json" });

      // Tạo URL download
      const url = URL.createObjectURL(blob);

      // Tạo <a> element và click để download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formName.replace(/\s+/g, "_")}.json`; // Tên file: form-name.json
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);

      setSaveMessage("✅ Xuất form thành công!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Lỗi:", error);
      setSaveMessage("❌ Lỗi khi xuất form");
    }
  };

  /**
   * GIẢI THÍCH handleSave:
   * - CREATE MODE: POST request (tạo form mới)
   * - EDIT MODE: PUT request (cập nhật form cũ)
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage("");

      const formJson = query.serialize();
      const token = localStorage.getItem("token");

      if (!token) {
        setSaveMessage("❌ Chưa đăng nhập!");
        return;
      }

      const payload = {
        title: formName,
        schema: formJson,
      };

      let response;
      let successMessage;

      if (formId && formId !== "new") {
        // EDIT MODE: Cập nhật form cũ
        response = await fetch(`http://localhost:3000/api/forms/${formId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        successMessage = "✅ Cập nhật form thành công!";
      } else {
        // CREATE MODE: Tạo form mới
        response = await fetch("http://localhost:3000/api/forms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        successMessage = "✅ Tạo form thành công!";
      }

      if (!response.ok) {
        throw new Error("Lỗi khi lưu form");
      }

      const data = await response.json();
      setSaveMessage(successMessage);

      // Nếu là create mode: redirect sang edit mode (có formId)
      if (!formId || formId === "new") {
        setTimeout(() => {
          navigate(`/builder/${data._id}`);
        }, 1000);
      } else {
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setSaveMessage("❌ Lỗi: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
      {/* Nút Back */}
      <Button asChild variant="outline">
        <Link to="/forms">← Quay lại</Link>
      </Button>

      {/* Input tên form */}
      <div className="flex-1 mx-6">
        <Input
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Đặt tên form..."
          className="max-w-sm text-lg font-semibold"
        />
      </div>

      {/* Save & Export & Import buttons */}
      <div className="flex items-center gap-2">
        {saveMessage && (
          <span className="text-sm font-medium text-gray-600">
            {saveMessage}
          </span>
        )}
        <Button
          onClick={() => setIsPreviewOpen(true)}
          variant="outline"
          className="text-gray-700"
        >
          Xem trước
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          className="text-gray-700"
        >
          📥 Xuất
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? "Đang lưu..." : "Lưu"}
        </Button>
        {/* Logout button */}
        <Button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          🚪 Đăng Xuất
        </Button>
      </div>

      {/* FORM PREVIEW MODAL */}
      <FormPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
