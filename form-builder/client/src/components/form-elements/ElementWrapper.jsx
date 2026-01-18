import { useNode } from "@craftjs/core";
import { useRef, useState, useEffect } from "react";
import { GripVertical } from "lucide-react";

/**
 * GIẢI THÍCH ELEMENT WRAPPER:
 * - Wrapper cho tất cả form elements
 * - Hỗ trợ resize bằng drag handle ở các border
 * - Hỗ trợ drag-to-reorder để sắp xếp lại các element
 * - Hiển thị resize handles khi element được chọn
 */

export function ElementWrapper({ children, element }) {
  const { isSelected, node, actions } = useNode((node) => ({
    isSelected: node.events.selected,
  }));

  const wrapperRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResizeStart = (e, position) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    });
    setDimensions({ width: rect.width, height: rect.height });
  };

  // DRAG-TO-REORDER HANDLERS
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDragStart({ y: e.clientY });
  };

  const handleDragMouseMove = (e) => {
    if (!isDragging) return;

    const deltaY = e.clientY - dragStart.y;

    // Nếu kéo xuống > 30px thì di chuyển xuống
    if (deltaY > 30) {
      moveElement("down");
      setIsDragging(false);
    }
    // Nếu kéo lên > 30px thì di chuyển lên
    else if (deltaY < -30) {
      moveElement("up");
      setIsDragging(false);
    }
  };

  const handleDragMouseUp = () => {
    setIsDragging(false);
  };

  // Move element up/down
  const moveElement = (direction) => {
    if (!node) return;

    const parentNode = node.parent;
    if (!parentNode) return;

    const siblings = parentNode.data.nodes || [];
    const currentIndex = siblings.indexOf(node.id);

    if (direction === "up" && currentIndex > 0) {
      // Move up: delete and add before previous
      const previousNodeId = siblings[currentIndex - 1];
      const nodeData = node.toSerializedNode();

      actions.delete(node.id);
      setTimeout(() => {
        actions.add(nodeData, previousNodeId, 0);
      }, 0);
    } else if (direction === "down" && currentIndex < siblings.length - 1) {
      // Move down: delete and add after next
      const nextNodeId = siblings[currentIndex + 1];
      const nodeData = node.toSerializedNode();

      actions.delete(node.id);
      setTimeout(() => {
        actions.add(nodeData, nextNodeId, 1);
      }, 0);
    }
  };

  // Attach event listeners for drag-to-reorder
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMouseMove);
      document.addEventListener("mouseup", handleDragMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleDragMouseMove);
        document.removeEventListener("mouseup", handleDragMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    newWidth = Math.max(60, resizeStart.width + deltaX);
    newHeight = Math.max(40, resizeStart.height + deltaY);

    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false);
      // Lưu dimensions vào element
      if (dimensions.width > 0 && dimensions.height > 0) {
        actions.setProp((props) => {
          props.customWidth = `${Math.round(dimensions.width)}px`;
          props.customHeight = `${Math.round(dimensions.height)}px`;
        });
      }
    }
  };

  // Attach event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, resizeStart, dimensions]);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block group ${isDragging ? "opacity-60" : ""}`}
      style={{
        width: isResizing ? `${dimensions.width}px` : "auto",
        height: isResizing ? `${dimensions.height}px` : "auto",
      }}
    >
      {/* Drag Handle - để kéo element lên/xuống */}
      {isSelected && (
        <div
          onMouseDown={handleDragStart}
          className="absolute -left-8 top-1/2 transform -translate-y-1/2 p-1 cursor-grab hover:bg-blue-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Kéo để sắp xếp lại"
        >
          <GripVertical size={16} className="text-blue-500" />
        </div>
      )}

      {children}

      {/* Resize Handles - hiện khi selected */}
      {isSelected && (
        <>
          {/* Top-right corner */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "tr")}
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-nwse-resize rounded-full"
            title="Kéo để thay đổi kích cỡ"
          />
          {/* Bottom-right corner */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "br")}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-nwse-resize rounded-full"
            title="Kéo để thay đổi kích cỡ"
          />
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "r")}
            className="absolute top-1/2 -right-1 w-2 h-6 bg-blue-500 border border-white cursor-ew-resize rounded-full transform -translate-y-1/2"
            title="Kéo để thay đổi chiều rộng"
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "b")}
            className="absolute -bottom-1 left-1/2 h-2 w-6 bg-blue-500 border border-white cursor-ns-resize rounded-full transform -translate-x-1/2"
            title="Kéo để thay đổi chiều cao"
          />
        </>
      )}
    </div>
  );
}
