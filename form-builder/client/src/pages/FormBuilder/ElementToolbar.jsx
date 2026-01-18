import { useEditor } from "@craftjs/core";
import { Trash2, Copy } from "lucide-react";
import React from "react";

/**
 * GIẢI THÍCH ELEMENT TOOLBAR:
 * - Thanh công cụ hiển thị ngay trên element
 * - Hiển thị nút: Xóa, Nhân bản
 * - Chỉ hiển thị khi element được chọn
 * - Di chuyển element bằng kéo grip handle trên element
 */

export default function ElementToolbar({ elementId }) {
  const { actions, query } = useEditor();

  if (!elementId) return null;

  // Lấy vị trí của element để hiển toolbar phía trên
  const node = query.node(elementId).get();
  const elementDOM = node?.dom;

  let toolbarStyle = {};
  if (elementDOM) {
    const rect = elementDOM.getBoundingClientRect();
    toolbarStyle = {
      position: "fixed",
      top: `${rect.top - 50}px`,
      left: `${rect.left}px`,
      zIndex: 1000,
    };
  }

  /**
   * GIẢI THÍCH handleDelete:
   * - Xóa element khỏi canvas
   */
  const handleDelete = () => {
    actions.delete(elementId);
  };

  /**
   * GIẢI THÍCH handleDuplicate:
   * - Nhân bản element được chọn
   * - Tạo React element mới từ component và props
   */
  const handleDuplicate = () => {
    try {
      // Lấy thông tin node hiện tại
      const currentNode = query.node(elementId).get();
      const parentId = currentNode.data.parent;

      // Lấy component type và props
      const componentType = currentNode.data.type;
      const componentProps = { ...currentNode.data.props };

      // Tạo React element mới
      const newElement = query
        .parseReactElement(React.createElement(componentType, componentProps))
        .toNodeTree();

      // Thêm node tree vào parent
      actions.addNodeTree(newElement, parentId);

      console.log("✅ Nhân bản thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi nhân bản:", error);
    }
  };

  return (
    <div
      style={toolbarStyle}
      className="flex items-center gap-2 bg-white border-2 border-blue-400 rounded-lg shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Label */}
      <span className="text-xs font-medium text-gray-600 px-2">Công cụ:</span>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-300"></div>

      {/* Nút nhân bản */}
      <button
        onClick={handleDuplicate}
        title="Nhân bản element này"
        className="flex items-center gap-1.5 px-3 py-2 hover:bg-green-50 rounded text-green-600 transition-all hover:scale-105 active:scale-95"
      >
        <Copy size={16} />
        <span className="text-xs font-medium">Nhân bản</span>
      </button>

      {/* Nút xóa */}
      <button
        onClick={handleDelete}
        title="Xóa element này"
        className="flex items-center gap-1.5 px-3 py-2 hover:bg-red-50 rounded text-red-600 transition-all hover:scale-105 active:scale-95"
      >
        <Trash2 size={16} />
        <span className="text-xs font-medium">Xóa</span>
      </button>
    </div>
  );
}
