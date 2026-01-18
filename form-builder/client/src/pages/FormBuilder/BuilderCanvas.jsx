import { useDroppable } from "@dnd-kit/core";
import { useEditor } from "@craftjs/core";
import ElementToolbar from "./ElementToolbar";
import { DragIndicatorLine } from "@/components/DragIndicatorLine";

/**
 * GIẢI THÍCH BUILDER CANVAS:
 * - Vùng thả (drop zone) cho dnd-kit kéo element từ sidebar
 * - Craft.js tự động xử lý drag-drop nội bộ giữa các element
 * - Hiển thị toolbar khi có element được chọn
 */

export default function BuilderCanvas({ children, isPreviewOpen }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });
  const { selected } = useEditor((state) => {
    // Lấy tất cả selected nodes
    const currentlySelected = state.events.selected;
    return {
      selected: currentlySelected,
    };
  });

  // Lấy ID của element được chọn
  const selectedId =
    selected && selected.size > 0 ? Array.from(selected)[0] : null;

  return (
    <main
      className={`flex-1 overflow-auto relative transition-colors p-8 ${
        isOver ? "bg-blue-100" : "bg-gray-50"
      }`}
      ref={setNodeRef}
    >
      <div className="w-full h-full flex items-start justify-center">
        {children}
      </div>

      {/* Hiển thị toolbar nếu có element được chọn và không đang xem trước */}
      {selectedId && selectedId !== "ROOT" && !isPreviewOpen && (
        <ElementToolbar elementId={selectedId} />
      )}

      {/* Hiển thị drag indicator line */}
      <DragIndicatorLine />
    </main>
  );
}
