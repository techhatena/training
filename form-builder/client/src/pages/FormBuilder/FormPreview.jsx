import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

/**
 * GIẢI THÍCH FORM PREVIEW:
 * - Hiển thị form ở chế độ xem trước (không thể chỉnh sửa)
 * - Render thực tế các elements từ canvas trong FormContainer
 * - Layout chuẩn: không lung tung, căn giữa
 */

export default function FormPreview({ isOpen, onClose }) {
  const { query, actions } = useEditor();

  // Clear selection khi mở preview
  React.useEffect(() => {
    if (isOpen) {
      actions.selectNode(null);
    }
  }, [isOpen, actions]);

  if (!isOpen) return null;

  // Lấy children của ROOT node
  const getFormChildren = () => {
    if (!query) return [];

    try {
      const nodes = query.getSerializedNodes();

      if (!nodes || typeof nodes !== "object") {
        return [];
      }

      const rootNode = nodes["ROOT"];
      if (!rootNode) {
        return [];
      }

      // Lấy children từ rootNode.nodes
      const childrenIds = rootNode.nodes || [];
      return childrenIds;
    } catch (error) {
      console.error("❌ Error:", error);
      return [];
    }
  };

  // Render element theo tên component
  const renderElement = (element, childId) => {
    if (!element) {
      return null;
    }

    // Data nằm trực tiếp trong element, không có nested .data
    const displayName = element.displayName;
    const props = element.props || {};
    const key = childId;

    switch (displayName) {
      case "TextField":
        return (
          <div key={key} className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {props.label || "Input Field"}
            </label>
            <input
              type="text"
              placeholder={props.placeholder || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "Textarea":
        return (
          <div key={key} className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {props.label || "Textarea"}
            </label>
            <textarea
              placeholder={props.placeholder || ""}
              rows={props.rows || 4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "Button":
        const getSizeClass = () => {
          switch (props.size) {
            case "sm":
              return "px-3 py-1 text-xs";
            case "lg":
              return "px-6 py-3 text-base";
            case "xl":
              return "px-8 py-4 text-lg";
            default:
              return "px-4 py-2 text-sm";
          }
        };

        const getButtonClass = () => {
          const baseStyle = `rounded-md font-medium transition ${getSizeClass()}`;
          const widthClass = props.alignment === "full" ? "w-full" : "";

          switch (props.variant) {
            case "secondary":
              return `${baseStyle} ${widthClass} bg-gray-200 text-gray-800 hover:bg-gray-300`;
            case "danger":
              return `${baseStyle} ${widthClass} bg-red-500 text-white hover:bg-red-600`;
            default:
              return `${baseStyle} ${widthClass} bg-blue-500 text-white hover:bg-blue-600`;
          }
        };

        const getButtonInlineStyle = () => {
          const style = {};
          if (props.customWidth) {
            style.width =
              props.customWidth.includes("px") ||
              props.customWidth.includes("%")
                ? props.customWidth
                : `${props.customWidth}px`;
          }
          if (props.customHeight) {
            style.height =
              props.customHeight.includes("px") ||
              props.customHeight.includes("%")
                ? props.customHeight
                : `${props.customHeight}px`;
          }
          return style;
        };

        const getButtonWrapperClass = () => {
          switch (props.alignment) {
            case "left":
              return "flex justify-start";
            case "right":
              return "flex justify-end";
            case "center":
              return "flex justify-center";
            default:
              return "w-full";
          }
        };

        return (
          <div key={key} className={`mb-4 ${getButtonWrapperClass()}`}>
            <button className={getButtonClass()} style={getButtonInlineStyle()}>
              {props.text || "Submit"}
            </button>
          </div>
        );

      case "Title":
        const titleClass = {
          h1: "text-4xl",
          h2: "text-2xl",
          h3: "text-xl",
        }[props.size || "h2"];

        const bgClass = {
          white: "bg-white",
          blue: "bg-blue-100",
          gray: "bg-gray-100",
        }[props.bgColor || "white"];

        return (
          <div key={key} className={`mb-4 p-3 rounded ${bgClass}`}>
            <h2 className={`font-bold text-gray-900 ${titleClass}`}>
              {props.text || "Tiêu đề Form"}
            </h2>
          </div>
        );

      case "Text":
        const textColor = {
          dark: "text-gray-900",
          light: "text-gray-500",
          gray: "text-gray-700",
        }[props.color || "gray"];

        const textAlign = {
          center: "text-center",
          right: "text-right",
          left: "text-left",
        }[props.align || "left"];

        return (
          <div
            key={key}
            className={`mb-4 text-sm leading-relaxed ${textColor} ${textAlign}`}
          >
            {props.content || "Đây là văn bản mô tả"}
          </div>
        );

      default:
        return null;
    }
  };

  const childrenIds = getFormChildren();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Container chính */}
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Xem trước Form</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview content */}
        <div className="p-8 bg-gray-50">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow">
            {childrenIds && childrenIds.length > 0 ? (
              <div className="space-y-4">
                {childrenIds.map((childId) => {
                  try {
                    const serializedNodes = query.getSerializedNodes();
                    const node = serializedNodes?.[childId];
                    if (!node) {
                      return null;
                    }
                    return renderElement(node, childId);
                  } catch (error) {
                    console.error("❌ Error rendering child:", childId, error);
                    return null;
                  }
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Không có element nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
