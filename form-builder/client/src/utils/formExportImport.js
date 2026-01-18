/**
 * UTILITY FUNCTIONS FOR FORM IMPORT/EXPORT
 */

/**
 * GIẢI THÍCH downloadJSON:
 * - Download object dưới dạng file .json
 * - data: object cần download
 * - filename: tên file (không cần .json extension)
 */
export const downloadJSON = (data, filename) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Lỗi khi download:", error);
    return false;
  }
};

/**
 * GIẢI THÍCH readJSONFile:
 * - Đọc nội dung file JSON
 * - file: File object từ input[type="file"]
 * - Trả về parsed JSON hoặc error
 */
export const readJSONFile = async (file) => {
  try {
    if (!file) throw new Error("Chưa chọn file");

    // Kiểm tra loại file
    if (!file.name.endsWith(".json")) {
      throw new Error("Vui lòng chọn file .json");
    }

    // Đọc file content
    const text = await file.text();

    // Parse JSON
    const data = JSON.parse(text);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof SyntaxError ? "File JSON không hợp lệ" : error.message,
    };
  }
};

/**
 * GIẢI THÍCH validateFormJSON:
 * - Validate form JSON có đúng structure không
 * - Phải có field "structure"
 * - Phải có field "name"
 */
export const validateFormJSON = (data) => {
  if (!data) return { valid: false, error: "Dữ liệu rỗng" };
  if (!data.structure)
    return { valid: false, error: "Thiếu field 'structure'" };
  if (!data.name) return { valid: false, error: "Thiếu field 'name'" };

  return { valid: true };
};
