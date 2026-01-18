import { useNode } from "@craftjs/core";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * GIẢI THÍCH TEXTAREA:
 * - Component textarea có thể kéo thả và chỉnh sửa trong form builder
 * - useNode: hook lấy thông tin node hiện tại (selected, props, etc)
 * - Hỗ trợ inline editing cho label
 * - Hỗ trợ drag-to-reorder (kéo lên/xuống để sắp xếp)
 */

export function Textarea({
  label = "Textarea",
  placeholder = "Nhập văn bản...",
  rows = 4,
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
        {/* LABEL - chỉ hiển thị */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        {/* TEXTAREA - chỉ hiển thị */}
        <textarea
          placeholder={placeholder}
          rows={rows}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none bg-gray-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
}

Textarea.craft = {
  displayName: "Textarea",
  props: {
    label: "Textarea",
    placeholder: "Nhập văn bản...",
    rows: 4,
    customWidth: "",
    customHeight: "",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
};
