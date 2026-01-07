import { useState, useRef, useEffect } from "react";
import { updateTasks, deleteTasks } from "../api/api";
import { Edit2, Trash2, MoreVertical, CircleCheck, X } from "lucide-react";
import LoadingModal from "./LoadingModal";
import ConfirmModal from "./ConfirmModal";

export default function TaskCard({
  task,
  onTaskUpdated,
  onEdit,
  onShowDetail,
  openMenuId,
  onMenuToggle,
}) {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState("loading"); // loading, success, error
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuRef = useRef(null);

  const showMenu = openMenuId === task._id;

  // Click outside dropdown menu to close
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onMenuToggle(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, onMenuToggle, task._id]);

  // Hàm xác định màu border-top
  const getBorderColor = () => {
    const now = new Date();
    const startDate = new Date(task.ngayBatDau);
    const endDate = new Date(task.ngayKetThuc);

    // Task đã hoàn thành
    if (task.trangThai) {
      return "border-t-4 border-t-green-500"; // Xanh lá
    }

    // Task chưa hoàn thành
    // Hết hạn
    if (now > endDate) {
      return "border-t-4 border-t-red-500"; // Đỏ
    }

    // Tính nửa thời gian
    const totalTime = endDate - startDate;
    const elapsedTime = now - startDate;
    const halfTime = totalTime / 2;

    // Đã qua nửa hạn
    if (elapsedTime > halfTime) {
      return "border-t-4 border-t-yellow-500"; // Vàng
    }

    // Mới lập
    return "border-t-4 border-t-blue-500"; // Xanh dương
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    setLoadingType("loading");
    setLoadingMessage(
      task.trangThai
        ? "Đang đánh dấu chưa hoàn thành..."
        : "Đang đánh dấu hoàn thành..."
    );
    try {
      await updateTasks(task._id, { trangThai: !task.trangThai });
      setLoadingType("success");
      setLoadingMessage(
        task.trangThai
          ? "Đánh dấu chưa hoàn thành thành công"
          : "Đánh dấu hoàn thành thành công"
      );
      setTimeout(() => {
        setLoading(false);
        onTaskUpdated();
      }, 1800);
    } catch (error) {
      console.error("Error updating task:", error);
      setLoadingType("error");
      setLoadingMessage("Cập nhật task thất bại");
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    setLoadingType("loading");
    setLoadingMessage("Đang xóa...");
    try {
      await deleteTasks(task._id);
      setLoadingType("success");
      setLoadingMessage("Xóa task thành công");
      onMenuToggle(null);
      setTimeout(() => {
        setLoading(false);
        onTaskUpdated();
      }, 1800);
    } catch (error) {
      console.error("Error deleting task:", error);
      setLoadingType("error");
      setLoadingMessage("Xóa task thất bại");
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  };

  const handleEdit = () => {
    onMenuToggle(null);
    if (onEdit) onEdit(task._id);
  };

  // Close menu khi click ngoài
  const handleClickOutside = () => {
    onMenuToggle(null);
  };

  return (
    <>
      <div
        className={`flex items-start gap-4 p-4 rounded-lg shadow-md bg-white transition hover:shadow-xl hover:-translate-y-1 cursor-pointer ${getBorderColor()}`}
        onClick={handleClickOutside}
      >
        {/* Checkbox / Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={loading}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-1 transition flex items-center justify-center ${
            isHovered
              ? task.trangThai
                ? "bg-red-500 border-red-500"
                : "bg-blue-500 border-blue-500"
              : task.trangThai
              ? "bg-green-500 border-green-500"
              : "border-gray-300 hover:border-blue-500"
          }`}
        >
          {isHovered ? (
            task.trangThai ? (
              <X size={16} className="text-white" strokeWidth={2.5} />
            ) : (
              <CircleCheck size={16} className="text-white" strokeWidth={2.5} />
            )
          ) : (
            task.trangThai && (
              <CircleCheck size={16} className="text-white" strokeWidth={2.5} />
            )
          )}
        </button>

        {/* Task Content */}
        <div
          className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition"
          onClick={(e) => {
            e.stopPropagation();
            if (onShowDetail) onShowDetail(task._id);
          }}
        >
          <h3 className="font-bold text-black text-base truncate">
            {task.title}
          </h3>
          <p className="text-gray-500 text-sm truncate line-clamp-1">
            {task.moTa || "Không có mô tả"}
          </p>
          <div className="text-right text-xs text-gray-400 -mr-10 mt-2">
            Tạo lúc: {task.createdAt}
          </div>
        </div>

        {/* Menu Button */}
        <div
          className="relative flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle(task._id);
            }}
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 text-sm"
              >
                <Edit2 size={16} />
                Chỉnh sửa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
                disabled={loading}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 text-sm disabled:opacity-50 border-t border-gray-100"
              >
                <Trash2 size={16} />
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Modal */}
      {loading && (
        <LoadingModal
          message={loadingMessage}
          type={loadingType}
          onClose={() => setLoading(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Xóa task"
        message={`Bạn chắc chắn muốn xóa "${task.title}" không?`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDangerous={true}
      />
    </>
  );
}
