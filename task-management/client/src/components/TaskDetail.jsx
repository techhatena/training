import { Edit2 } from "lucide-react";

export default function TaskDetail({ task, isOpen, onClose, onEdit }) {
  if (!isOpen) return null;

  const getStatusLabel = () => {
    return task.trangThai ? "Đã hoàn thành" : "Đang tiến hành";
  };

  const getStatusColor = () => {
    return task.trangThai
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-yellow-100 text-yellow-800 border border-yellow-300";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 break-words">
          {task.title}
        </h2>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}
          >
            {getStatusLabel()}
          </span>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {task.moTa || "Không có mô tả"}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-600 text-xs font-semibold mb-1">
              Ngày bắt đầu
            </label>
            <p className="text-gray-800">
              {task.ngayBatDau || "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <label className="block text-gray-600 text-xs font-semibold mb-1">
              Ngày kết thúc
            </label>
            <p className="text-gray-800">
              {task.ngayKetThuc || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-red-500 hover:text-white transition font-semibold"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(task._id);
            }}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
          >
            <Edit2 size={16} />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
