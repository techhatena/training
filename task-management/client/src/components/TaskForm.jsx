import { useState, useEffect } from "react";
import { addTasks, updateTasks, getByTasks } from "../api/api";
import { Plus, X, Loader2 } from "lucide-react";
import LoadingModal from "./LoadingModal";

export default function TaskForm({
  onTaskAdded,
  editingTaskId,
  onCloseEdit,
  onCloseDetail,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    moTa: "",
    ngayBatDau: "",
    ngayKetThuc: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiLoadingType, setApiLoadingType] = useState("loading"); // loading, success, error
  const [apiMessage, setApiMessage] = useState("");

  // Load task data when editingTaskId changes
  useEffect(() => {
    if (editingTaskId) {
      loadTaskData();
    }
  }, [editingTaskId]);

  const loadTaskData = async () => {
    try {
      setApiLoading(true);
      const response = await getByTasks(editingTaskId);
      const taskData = response.data;

      setFormData({
        title: taskData.title || "",
        moTa: taskData.moTa || "",
        ngayBatDau: parseDate(taskData.ngayBatDauRaw, taskData.ngayBatDau),
        ngayKetThuc: parseDate(taskData.ngayKetThucRaw, taskData.ngayKetThuc),
      });
      setIsEditMode(true);
      setIsOpen(true);
      setErrors({});
      setGeneralError("");
    } catch (err) {
      setGeneralError("Không thể tải dữ liệu task");
      console.error("Error loading task:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const parseDate = (rawDate, displayDate) => {
    // Try to parse raw ISO date first
    if (rawDate) {
      const result = formatDateTimeToInput(rawDate);
      if (result) {
        return result;
      }
    }

    // Fallback to parse display date
    if (displayDate && displayDate !== "Chưa cập nhật") {
      const result = parseDisplayDateToInput(displayDate);
      if (result) {
        return result;
      }
    }

    return "";
  };

  const parseDisplayDateToInput = (displayDateStr) => {
    // Parse multiple format options
    if (!displayDateStr || displayDateStr === "Chưa cập nhật") return "";

    try {
      // Try format: DD/MM/YYYY HH:MM SA/CH (Vietnamese time)
      let regex = /(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})\s(SA|CH)/;
      let match = displayDateStr.match(regex);

      if (match) {
        let [, day, month, year, hours, minutes, timeOfDay] = match;
        hours = parseInt(hours);
        if (timeOfDay === "CH" && hours !== 12) {
          hours += 12;
        } else if (timeOfDay === "SA" && hours === 12) {
          hours = 0;
        }
        hours = String(hours).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      regex = /(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})\s(SA|CH)/;
      match = displayDateStr.match(regex);

      if (match) {
        let [, day, month, year, hours, minutes, ampm] = match;
        hours = parseInt(hours);
        if (ampm === "CH" && hours !== 12) {
          hours += 12;
        } else if (ampm === "SA" && hours === 12) {
          hours = 0;
        }
        hours = String(hours).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      regex = /(\d{2}):(\d{2})\s(SA|CH)\s(\d{2})-(\d{2})-(\d{4})/;
      match = displayDateStr.match(regex);

      if (match) {
        let [, hours, minutes, ampm, day, month, year] = match;
        hours = parseInt(hours);
        if (ampm === "CH" && hours !== 12) {
          hours += 12;
        } else if (ampm === "SA" && hours === 12) {
          hours = 0;
        }
        hours = String(hours).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      return "";
    } catch (err) {
      return "";
    }
  };

  const formatDateTimeToInput = (isoString) => {
    // Parse ISO string (e.g., "2026-01-07T09:54:00.000Z") to datetime-local format
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng điền vào trường tiêu đề";
    }

    if (!formData.ngayKetThuc) {
      newErrors.ngayKetThuc = "Vui lòng điền vào trường ngày kết thúc";
    }

    // ngayBatDau không bắt buộc - sẽ auto-fill thời gian hiện tại
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setApiLoading(true);
    setApiLoadingType("loading");
    setApiMessage("Đang xử lý...");

    try {
      // Auto-fill ngayBatDau nếu không nhập
      const submitData = { ...formData };
      if (!submitData.ngayBatDau) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        submitData.ngayBatDau = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      if (isEditMode && editingTaskId) {
        await updateTasks(editingTaskId, submitData);
        setApiLoadingType("success");
        setApiMessage("Cập nhật task thành công!");
      } else {
        await addTasks(submitData);
        setApiLoadingType("success");
        setApiMessage("Tạo task thành công!");
      }

      setTimeout(() => {
        setFormData({
          title: "",
          moTa: "",
          ngayBatDau: "",
          ngayKetThuc: "",
        });
        setErrors({});
        setIsOpen(false);
        setIsEditMode(false);
        setApiMessage("");
        onTaskAdded();
        if (onCloseEdit) onCloseEdit();
        setApiLoading(false);
      }, 1800);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        (isEditMode ? "Cập nhật task thất bại" : "Tạo task thất bại");
      setApiLoadingType("error");
      setApiMessage(errorMessage);
      setTimeout(() => {
        setApiLoading(false);
      }, 1800);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setFormData({
      title: "",
      moTa: "",
      ngayBatDau: "",
      ngayKetThuc: "",
    });
    setErrors({});
    setGeneralError("");
    if (onCloseEdit) onCloseEdit();
  };

  return (
    <>
      {/* Add Task Button */}
      {!isEditMode && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (onCloseDetail) onCloseDetail(); // Đóng task detail modal
          }}
          className="bg-black/50 px-6 py-3 text-white flex items-center gap-2 rounded-r-lg hover:bg-gray-800 transition md:px-3"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Add Task</span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={handleClose}
              disabled={apiLoading}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditMode ? "Chỉnh Sửa Task" : "Tạo Task Mới"}
            </h2>

            <form onSubmit={handleSubmit}>
              {generalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {generalError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={apiLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Nhập tiêu đề task"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mô tả
                </label>
                <textarea
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  disabled={apiLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Nhập mô tả (tùy chọn)"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="datetime-local"
                  name="ngayBatDau"
                  value={formData.ngayBatDau}
                  onChange={handleChange}
                  disabled={apiLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nếu không nhập, sẽ tự động lấy thời gian hiện tại
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="datetime-local"
                  name="ngayKetThuc"
                  value={formData.ngayKetThuc}
                  onChange={handleChange}
                  disabled={apiLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 ${
                    errors.ngayKetThuc
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.ngayKetThuc && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ngayKetThuc}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-red-500 hover:text-white transition font-semibold disabled:bg-gray-400"
                  disabled={apiLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={apiLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {apiLoading && <Loader2 size={16} className="animate-spin" />}
                  {apiLoading
                    ? isEditMode
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : isEditMode
                    ? "Cập nhật"
                    : "Tạo Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {apiLoading && (
        <LoadingModal
          message={apiMessage}
          type={apiLoadingType}
          onClose={() => setApiLoading(false)}
        />
      )}
    </>
  );
}
