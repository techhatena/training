import { useNode } from "@craftjs/core";
import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TextField({
  label = "Input Field",
  placeholder = "",
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

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false);
  const labelRef = useRef(null);
  const placeholderRef = useRef(null);

  const handleLabelChange = (newLabel) => {
    actions.setProp((props) => {
      props.label = newLabel;
    });
  };

  const handlePlaceholderChange = (newPlaceholder) => {
    actions.setProp((props) => {
      props.placeholder = newPlaceholder;
    });
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setIsEditingLabel(true);
      setTimeout(() => labelRef.current?.focus(), 0);
    }
  };

  const handlePlaceholderClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setIsEditingPlaceholder(true);
      setTimeout(() => placeholderRef.current?.focus(), 0);
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
        style={getInlineStyle()}
        className={`border rounded-md p-3 bg-white transition-all w-full relative ${
          isSelected
            ? "ring-2 ring-blue-500 shadow-lg border-blue-500"
            : "hover:shadow-md border-gray-300"
        }`}
      >
        {isEditingLabel ? (
          <input
            ref={labelRef}
            type="text"
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            onBlur={() => setIsEditingLabel(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingLabel(false);
            }}
            className="text-sm font-medium block mb-2 text-gray-700 w-full border border-blue-300 rounded px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <label
            onClick={handleLabelClick}
            className={`text-sm font-medium block mb-2 text-gray-700 ${
              isSelected ? "cursor-text hover:bg-blue-50" : "cursor-default"
            } px-2 py-1 rounded`}
          >
            {label || "Click để thêm label"}
          </label>
        )}
        {isEditingPlaceholder ? (
          <input
            ref={placeholderRef}
            type="text"
            value={placeholder}
            onChange={(e) => handlePlaceholderChange(e.target.value)}
            onBlur={() => setIsEditingPlaceholder(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingPlaceholder(false);
            }}
            className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none italic text-gray-600"
            onClick={(e) => e.stopPropagation()}
            placeholder="Nhập placeholder..."
          />
        ) : (
          <input
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none cursor-text"
            placeholder={placeholder || "Click để thêm placeholder"}
            onClick={handlePlaceholderClick}
            readOnly
          />
        )}
      </div>
    </div>
  );
}
TextField.craft = {
  displayName: "TextField",
  props: {
    label: "Input Field",
    placeholder: "",
    customWidth: "",
    customHeight: "",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
};
