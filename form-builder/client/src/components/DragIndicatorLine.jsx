import { useDragIndicator } from "@/context/DragIndicatorContext";
import { useEffect, useRef } from "react";

/**
 * Component hiển thị đường xanh khi kéo element
 * - Hiển thị indicator line ở vị trí sẽ drop
 */
export function DragIndicatorLine() {
  const { dragIndicator } = useDragIndicator();
  const lineRef = useRef(null);

  useEffect(() => {
    if (!dragIndicator.isDragging || !dragIndicator.targetElementId) {
      if (lineRef.current) {
        lineRef.current.style.display = "none";
      }
      return;
    }

    const targetElement = document.querySelector(
      `[data-craft-id="${dragIndicator.targetElementId}"]`
    );

    if (!targetElement || lineRef.current === null) return;

    const rect = targetElement.getBoundingClientRect();
    const position = dragIndicator.position;

    if (lineRef.current) {
      lineRef.current.style.display = "block";
      lineRef.current.style.left = `${rect.left}px`;
      lineRef.current.style.width = `${rect.width}px`;

      if (position === "top") {
        lineRef.current.style.top = `${rect.top - 2}px`;
      } else if (position === "bottom") {
        lineRef.current.style.top = `${rect.bottom - 2}px`;
      }
    }
  }, [dragIndicator]);

  return (
    <div
      ref={lineRef}
      className="fixed h-1 bg-blue-500 z-[9999] pointer-events-none rounded-full shadow-lg transition-all duration-100"
      style={{
        display: "none",
        boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
      }}
    />
  );
}
