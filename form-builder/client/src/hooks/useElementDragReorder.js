import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { useEditor } from "@craftjs/core";
import { DragIndicatorContext } from "@/context/DragIndicatorContext";

/**
 * HOOK: useElementDragReorder
 * - Cho phép kéo các element lên/xuống để sắp xếp lại thứ tự
 * - Kéo lên > 30px thì di chuyển lên 1 vị trí
 * - Kéo xuống > 30px thì di chuyển xuống 1 vị trí
 * - Hiển thị visual indicator (đường xanh) để show vị trí drop
 * - Dùng trong các form element components
 */

export function useElementDragReorder(elementId) {
  const { query, actions } = useEditor();
  const dragContext = useContext(DragIndicatorContext);
  const dragStateRef = useRef({ isDragging: false, dragStartY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const moveElement = useCallback(
    (direction) => {
      try {
        console.log(
          "📦 moveElement called with direction:",
          direction,
          "elementId:",
          elementId
        );

        // Get the current state
        const allNodes = query.getState().nodes;
        if (!allNodes) {
          console.error("❌ No nodes in state");
          return;
        }

        const currentNode = allNodes[elementId];
        if (!currentNode) {
          console.error("❌ Current node not found:", elementId);
          return;
        }

        const parentId = currentNode.data.parent;
        if (!parentId) {
          console.error("❌ Parent ID not found");
          return;
        }

        const parentNode = allNodes[parentId];
        if (!parentNode) {
          console.error("❌ Parent node not found:", parentId);
          return;
        }

        const siblings = parentNode.data.nodes || [];
        const currentIndex = siblings.indexOf(elementId);
        console.log(
          "📊 Current index:",
          currentIndex,
          "Total siblings:",
          siblings.length
        );

        if (currentIndex === -1) {
          console.error("❌ Element not found in siblings");
          return;
        }

        let targetIndex = currentIndex;

        if (direction === "up" && currentIndex > 0) {
          targetIndex = currentIndex - 1;
        } else if (direction === "down" && currentIndex < siblings.length - 1) {
          targetIndex = currentIndex + 1;
        } else {
          console.log("⚠️ Cannot move in direction:", direction);
          return;
        }

        const targetId = siblings[targetIndex];
        console.log("✅ Moving from index", currentIndex, "to", targetIndex);

        // Use Craft.js built-in move function
        actions.move(elementId, parentId, targetIndex);
        console.log("✅ Element moved successfully!");
      } catch (error) {
        console.error("❌ Error moving element:", error);
      }
    },
    [elementId, query, actions]
  );

  const handleDragStart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("🟢 Drag START on element:", elementId);
      dragStateRef.current = { isDragging: true, dragStartY: e.clientY };
      setIsDragging(true);
    },
    [elementId]
  );

  const handleDragMouseMove = useCallback(
    (e) => {
      if (!dragStateRef.current.isDragging) return;

      const deltaY = e.clientY - dragStateRef.current.dragStartY;
      console.log("🟡 Drag MOVE - deltaY:", deltaY, "elementId:", elementId);

      // Tính toán element phía dưới/trên để show indicator
      const elementsAbove = document.elementsFromPoint(e.clientX, e.clientY);
      let targetId = null;
      let position = null;

      for (const elem of elementsAbove) {
        if (elem.dataset?.craftId) {
          targetId = elem.dataset.craftId;
          break;
        }
      }

      if (targetId && targetId !== elementId) {
        position = deltaY > 0 ? "bottom" : "top";
      }

      // Update drag indicator context if available
      if (dragContext?.setDragIndicator) {
        dragContext.setDragIndicator({
          isDragging: true,
          draggingElementId: elementId,
          targetElementId: targetId,
          position: position,
        });
      }

      if (deltaY > 30) {
        console.log("🟢 Moving DOWN");
        dragStateRef.current.isDragging = false;
        setIsDragging(false);
        if (dragContext?.setDragIndicator) {
          dragContext.setDragIndicator({
            isDragging: false,
            draggingElementId: null,
            targetElementId: null,
            position: null,
          });
        }
        moveElement("down");
      } else if (deltaY < -30) {
        console.log("🔵 Moving UP");
        dragStateRef.current.isDragging = false;
        setIsDragging(false);
        if (dragContext?.setDragIndicator) {
          dragContext.setDragIndicator({
            isDragging: false,
            draggingElementId: null,
            targetElementId: null,
            position: null,
          });
        }
        moveElement("up");
      }
    },
    [moveElement, elementId, dragContext]
  );

  const handleDragMouseUp = useCallback(() => {
    console.log("🔴 Drag END on element:", elementId);
    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    if (dragContext?.setDragIndicator) {
      dragContext.setDragIndicator({
        isDragging: false,
        draggingElementId: null,
        targetElementId: null,
        position: null,
      });
    }
  }, [dragContext, elementId]);

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
  }, [isDragging, handleDragMouseMove, handleDragMouseUp]);

  return {
    handleDragStart,
    isDragging,
  };
}
