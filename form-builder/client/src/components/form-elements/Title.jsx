import { useNode } from "@craftjs/core";
import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * GIẢI THÍCH TITLE:
 * - Component heading (tiêu đề)
 * - 3 size: h1, h2, h3
 * - Có thể thay đổi size và text trong settings hoặc inline
 * - Hỗ trợ drag-to-reorder (dùng nút mũi tên trên thanh công cụ)
 */

export function Title({
  text = "Tiêu đề Form",
  size = "h2",
  bgColor = "white",
  align = "left",
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

  const getBgClass = () => {
    switch (bgColor) {
      case "blue":
        return "bg-blue-100";
      case "gray":
        return "bg-gray-100";
      default: // white
        return "bg-white";
    }
  };

  const getTitleStyle = () => {
    const baseStyle = "font-bold text-gray-900 mb-0 block";
    const alignClass = getAlignClass();

    switch (size) {
      case "h1":
        return `${baseStyle} text-4xl ${alignClass}`;
      case "h3":
        return `${baseStyle} text-xl ${alignClass}`;
      default: // h2
        return `${baseStyle} text-2xl ${alignClass}`;
    }
  };

  const getAlignClass = () => {
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
        className={`space-y-2 p-4 rounded transition border border-gray-300 w-full relative ${
          isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"
        } ${getBgClass()}`}
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
            className={`w-full border border-blue-300 rounded px-3 py-2 font-bold text-gray-900 ${getTitleStyle()}`}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={getTitleStyle()}
            onClick={handleTextClick}
            title={isSelected ? "Click để chỉnh sửa" : ""}
            style={{ cursor: isSelected ? "text" : "default" }}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * CRAFT.JS CONFIGURATION
 * size options: "h1" (lớn) | "h2" (vừa) | "h3" (nhỏ)
 * bgColor options: "white" | "blue" | "gray"
 * align options: "left" | "center" | "right"
 */

Title.craft = {
  displayName: "Title",
  props: {
    text: "Tiêu đề Form",
    size: "h2",
    bgColor: "white",
    align: "left",
    customWidth: "",
    customHeight: "",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
};
