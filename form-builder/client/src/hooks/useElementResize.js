import { useState, useRef, useEffect } from "react";

/**
 * GIẢI THÍCH useElementResize:
 * - Hook để thêm resize functionality cho element
 * - Lắng nghe mouse events để resize
 * - Return handler và state cho resize
 */

export function useElementResize(actions, isSelected) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = elementRef.current?.getBoundingClientRect();
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

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = Math.max(80, resizeStart.width + deltaX);
      let newHeight = Math.max(40, resizeStart.height + deltaY);

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (dimensions.width > 0 && dimensions.height > 0) {
        actions.setProp((props) => {
          props.customWidth = `${Math.round(dimensions.width)}px`;
          props.customHeight = `${Math.round(dimensions.height)}px`;
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeStart, dimensions, actions]);

  return {
    elementRef,
    handleResizeStart,
    isResizing,
    dimensions,
    isSelected,
  };
}

/**
 * COMPONENT ResizeHandles:
 * - Hiển thị các handle để resize element
 * - Chỉ hiển thị khi element được chọn
 */
export function ResizeHandles({ isSelected, onResizeStart }) {
  if (!isSelected) return null;

  return (
    <>
      {/* Right edge */}
      <div
        onMouseDown={onResizeStart}
        className="absolute top-0 right-0 w-1 h-full bg-blue-400 hover:bg-blue-600 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
        title="Kéo để chỉnh chiều rộng"
      />
      {/* Bottom edge */}
      <div
        onMouseDown={onResizeStart}
        className="absolute bottom-0 left-0 h-1 w-full bg-blue-400 hover:bg-blue-600 cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity"
        title="Kéo để chỉnh chiều cao"
      />
      {/* Bottom-right corner */}
      <div
        onMouseDown={onResizeStart}
        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-nwse-resize rounded-tl"
        title="Kéo để chỉnh kích cỡ"
      />
    </>
  );
}
