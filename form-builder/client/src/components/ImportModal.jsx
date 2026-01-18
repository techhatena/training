import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * GIẢI THÍCH IMPORTMODAL:
 * - Component dialog/modal để import file JSON
 * - User chọn file .json
 * - Preview content trước khi import
 * - Xác nhận → gọi callback onImport
 */

export default function ImportModal({ isOpen, onClose, onImport }) {
  const [jsonFile, setJsonFile] = useState(null); // File được chọn
  const [jsonContent, setJsonContent] = useState(null); // Nội dung file
  const [error, setError] = useState(null); // Error message
  const [isLoading, setIsLoading] = useState(false); // Loading khi parse

  /**
   * GIẢI THÍCH handleFileChange:
   * - User chọn file
   * - Đọc file content
   * - Parse JSON
   * - Validate structure
   */
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setJsonContent(null);
    setIsLoading(true);

    try {
      // Đọc file content
      const text = await file.text();

      // Parse JSON
      const data = JSON.parse(text);

      // Validate: phải có structure
      if (!data.structure) {
        throw new Error("File không hợp lệ. Thiếu field 'structure'");
      }

      setJsonFile(file);
      setJsonContent(data);
    } catch (err) {
      console.error("Lỗi:", err);
      setError(
        err instanceof SyntaxError ? "File JSON không hợp lệ" : err.message
      );
      setJsonFile(null);
      setJsonContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * GIẢI THÍCH handleImport:
   * - Gọi callback onImport với nội dung JSON
   * - Đóng modal
   */
  const handleImport = () => {
    if (jsonContent) {
      onImport(jsonContent);
      handleClose();
    }
  };

  const handleClose = () => {
    setJsonFile(null);
    setJsonContent(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900">📂 Import Form</h2>

        {/* File input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Chọn file JSON
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full text-sm border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <p className="text-sm text-gray-600">⏳ Đang đọc file...</p>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Preview */}
        {jsonContent && (
          <div className="bg-gray-50 rounded p-3 space-y-2 max-h-48 overflow-y-auto">
            <p className="text-sm font-medium text-gray-700">Preview:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Tên form:</span>{" "}
                {jsonContent.name}
              </p>
              <p>
                <span className="font-semibold">Xuất lúc:</span>{" "}
                {new Date(jsonContent.exportedAt).toLocaleString("vi-VN")}
              </p>
              <p>
                <span className="font-semibold">Version:</span>{" "}
                {jsonContent.version}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button onClick={handleClose} variant="outline">
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!jsonContent || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}
