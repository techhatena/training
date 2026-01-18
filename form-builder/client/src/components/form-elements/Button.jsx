import { useNode } from "@craftjs/core";
import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * GIẢI THÍCH BUTTON:
 * - Component button có thể kéo thả trong form builder
 * - Hỗ trợ variant: primary (xanh), secondary (xám), danger (đỏ)
 * - Có thể chỉnh text và variant trong settings hoặc inline
 * - Support drag-to-reorder (dùng nút mũi tên trên thanh công cụ)
 */

export function Button({
  text = "Submit",
  variant = "primary",
  size = "md",
  alignment = "full",
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

  const [isEditingText, setIsEditingText] = useState(false);
  const textRef = useRef(null);

  const handleTextChange = (newText) => {
    actions.setProp((props) => {
      props.text = newText;
    });
  };

  const handleTextClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setIsEditingText(true);
      setTimeout(() => textRef.current?.focus(), 0);
    }
  };

  // Xác định kích thước button
  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1 text-xs";
      case "lg":
        return "px-6 py-3 text-base";
      case "xl":
        return "px-8 py-4 text-lg";
      default: // md
        return "px-4 py-2 text-sm";
    }
  };

  // Xác định căn lề button
  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      case "center":
        return "justify-center";
      default: // full
        return "";
    }
  };

  // Xác định wrapper full width hay không
  const getWrapperClass = () => {
    return alignment === "full" ? "w-full" : "flex gap-2";
  };

  const getButtonStyle = () => {
    const baseStyle = `rounded-md font-medium transition cursor-pointer text-white ${getSizeStyle()}`;

    const widthClass = alignment === "full" ? "w-full" : "";

    switch (variant) {
      case "secondary":
        return `${baseStyle} ${widthClass} bg-gray-200 text-gray-800 hover:bg-gray-300`;
      case "danger":
        return `${baseStyle} ${widthClass} bg-red-500 text-white hover:bg-red-600`;
      default: // primary
        return `${baseStyle} ${widthClass} bg-blue-500 text-white hover:bg-blue-600`;
    }
  };

  const getButtonInlineStyle = () => {
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
      {/* Drag Handle - để kéo element lên/xuống */}
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
        style={getButtonInlineStyle()}
        className={`p-3 rounded transition border ${getWrapperClass()} ${getAlignmentClass()} relative ${
          isSelected
            ? "ring-2 ring-blue-500 border-blue-500"
            : "border-gray-300 hover:shadow-md"
        } bg-white`}
      >
        {isEditingText ? (
          <input
            ref={textRef}
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditingText(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingText(false);
            }}
            className="w-full px-3 py-2 border border-blue-300 rounded text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            className={getButtonStyle()}
            onClick={handleTextClick}
            style={getButtonInlineStyle()}
            title={isSelected ? "Click để chỉnh sửa" : ""}
          >
            {text}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * CRAFT.JS CONFIGURATION
 * variant options: "primary" (xanh) | "secondary" (xám) | "danger" (đỏ)
 * size options: "sm" | "md" | "lg" | "xl"
 * alignment options: "left" | "center" | "right" | "full" (chiếm toàn bộ chiều rộng)
 * customWidth: chiều rộng tùy chỉnh (vd: "200px", "50%")
 * customHeight: chiều cao tùy chỉnh (vd: "50px")
 */

Button.craft = {
  displayName: "Button",
  props: {
    text: "Submit",
    variant: "primary",
    size: "md",
    alignment: "full",
    customWidth: "",
    customHeight: "",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
};
