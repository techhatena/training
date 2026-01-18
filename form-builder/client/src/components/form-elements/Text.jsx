import { useNode } from "@craftjs/core";
import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * GIẢI THÍCH TEXT:
 * - Component văn bản đơn giản (paragraph)
 * - Dùng để thêm mô tả, hướng dẫn cho form
 * - Có thể thay đổi nội dung inline trên canvas
 * - Hỗ trợ drag-to-reorder (dùng nút mũi tên trên thanh công cụ)
 */

export function Text({
  content = "Đây là văn bản mô tả",
  align = "left",
  color = "gray",
  customWidth = "",
  customHeight = "",
}) {
  const {
    connectors: { connect },
    isSelected,
    actions,
    id,
  } = useNode((node) => ({
    isSelected: node.events.selected,
    id: node.id,
  }));

  // dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditingContent, setIsEditingContent] = useState(false);
  const contentRef = useRef(null);

  const handleContentChange = (newContent) => {
    actions.setProp((props) => {
      props.content = newContent;
    });
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setIsEditingContent(true);
      setTimeout(() => contentRef.current?.focus(), 0);
    }
  };

  // Xác định màu sắc text
  const getTextColor = () => {
    switch (color) {
      case "dark":
        return "text-gray-900";
      case "light":
        return "text-gray-500";
      default: // gray
        return "text-gray-700";
    }
  };

  // Xác định căn lề text
  const getTextAlign = () => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default: // left
        return "text-left";
    }
  };

  const getInlineStyle = () => {
    const style = {};
    if (customWidth) {
      style.width =
        customWidth.includes("px") || customWidth.includes("%")
          ? customWidth
          : `${customWidth}px`;
    }
    if (customHeight) {
      style.height =
        customHeight.includes("px") || customHeight.includes("%")
          ? customHeight
          : `${customHeight}px`;
    }
    return style;
  };

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={`relative group select-none ${isDragging ? "opacity-50 z-50" : ""}`}
      data-craft-id={id}
    >
      {/* Drag Handle */}
      {isSelected && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-1/2 transform -translate-y-1/2 p-1.5 cursor-grab active:cursor-grabbing hover:bg-blue-100 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50"
          style={{ touchAction: "none", userSelect: "none" }}
          title="Kéo để sắp xếp lại"
        >
          <GripVertical size={18} className="text-blue-600" />
        </div>
      )}

      <div
        ref={(ref) => {
          if (ref) {
            connect(ref);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={getInlineStyle()}
        className={`p-3 rounded transition border ${
          isSelected
            ? "ring-2 ring-blue-500 border-blue-500"
            : "border-gray-300 hover:shadow-md"
        } bg-white w-full relative`}
      >
        {isEditingContent ? (
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={() => setIsEditingContent(false)}
            className={`w-full border border-blue-300 rounded px-3 py-2 text-sm leading-relaxed ${getTextColor()} ${getTextAlign()}`}
            onClick={(e) => e.stopPropagation()}
            rows={3}
          />
        ) : (
          <p
            onClick={handleContentClick}
            className={`text-sm leading-relaxed ${getTextColor()} ${getTextAlign()} ${
              isSelected ? "cursor-text hover:bg-blue-50" : "cursor-default"
            } px-2 py-1 rounded`}
            title={isSelected ? "Click để chỉnh sửa" : ""}
          >
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * CRAFT.JS CONFIGURATION
 * align options: "left" (trái) | "center" (giữa) | "right" (phải)
 * color options: "gray" (xám) | "dark" (đen) | "light" (nhạt)
 */

Text.craft = {
  displayName: "Text",
  props: {
    content: "Đây là văn bản mô tả",
    align: "left",
    color: "gray",
    customWidth: "",
    customHeight: "",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
};
