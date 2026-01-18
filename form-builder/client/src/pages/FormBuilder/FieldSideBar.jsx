import { Button as UIButton } from "@/components/ui/button";
import { useEditor, Element } from "@craftjs/core";
import { TextField } from "@/components/form-elements/TextField";
import { Textarea } from "@/components/form-elements/Textarea";
import { Button as FormButton } from "@/components/form-elements/Button";
import { Title } from "@/components/form-elements/Title";
import { Text } from "@/components/form-elements/Text";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

/**
 * GIẢI THÍCH DraggableField COMPONENT:
 * - useDraggable: hook từ dnd-kit để làm cho element có thể kéo
 * - id: định danh duy nhất cho item (dùng để biết cái nào đang kéo)
 * - setNodeRef: liên kết ref DOM để dnd-kit theo dõi
 * - listeners & attributes: để browser biết element này có thể kéo
 * - transform: tọa độ hiện tại của phần tử khi đang kéo
 */

function DraggableField({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none select-none cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

export default function FieldSidebar() {
  const { actions, query } = useEditor();

  /**
   * GIẢI THÍCH SIDEBAR:
   * - Đây là panel bên trái chứa các button để kéo element vào canvas
   * - Mỗi DraggableField có id khác nhau (input, textarea, button, title, text)
   * - Khi user kéo element từ đây -> handleDragEnd sẽ tạo element mới
   */

  return (
    <aside className="h-full p-4 space-y-3 flex flex-col">
      <h3 className="font-semibold text-sm text-gray-800">📦 Fields</h3>

      {/* SEPARATOR */}
      <div className="border-t"></div>

      {/* FIELDS CONTAINER */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {/* INPUT FIELD */}
        <DraggableField id="field-input">
          <UIButton
            variant="outline"
            className="w-full justify-start text-sm hover:bg-blue-50 hover:border-blue-300"
          >
            📝 Input
          </UIButton>
        </DraggableField>

        {/* TEXTAREA FIELD */}
        <DraggableField id="field-textarea">
          <UIButton
            variant="outline"
            className="w-full justify-start text-sm hover:bg-blue-50 hover:border-blue-300"
          >
            📄 Textarea
          </UIButton>
        </DraggableField>

        {/* BUTTON FIELD */}
        <DraggableField id="field-button">
          <UIButton
            variant="outline"
            className="w-full justify-start text-sm hover:bg-blue-50 hover:border-blue-300"
          >
            🔘 Button
          </UIButton>
        </DraggableField>

        {/* TITLE FIELD */}
        <DraggableField id="field-title">
          <UIButton
            variant="outline"
            className="w-full justify-start text-sm hover:bg-blue-50 hover:border-blue-300"
          >
            📌 Title
          </UIButton>
        </DraggableField>

        {/* TEXT FIELD */}
        <DraggableField id="field-text">
          <UIButton
            variant="outline"
            className="w-full justify-start text-sm hover:bg-blue-50 hover:border-blue-300"
          >
            ✍️ Text
          </UIButton>
        </DraggableField>
      </div>

      {/* HƯỚNG DẪN */}
      <div className="border-t pt-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          💡 Kéo field từ đây vào canvas để thêm vào form
        </p>
      </div>
    </aside>
  );
}
