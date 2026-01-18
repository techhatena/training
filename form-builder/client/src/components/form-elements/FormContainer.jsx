import { useNode } from "@craftjs/core";
import { useEditor } from "@craftjs/core";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";

/**
 * GIẢI THÍCH FORM CONTAINER:
 * - Khung giới hạn cho form, tất cả elements phải trong này
 * - Cấu trúc: flex column, padding, fixed width
 * - Chỉ cho phép drop elements bên trong
 */

export function FormContainer({ children }) {
  const {
    connectors: { connect, drag },
    isSelected,
    id,
  } = useNode((node) => ({
    isSelected: node.events.selected,
    id: node.id,
  }));

  const { actions, query } = useEditor();
  const [elementIds, setElementIds] = useState([]);

  // Lấy danh sách children IDs
  useEffect(() => {
    const node = query.node(id).get();
    if (node && node.data.nodes) {
      setElementIds(node.data.nodes);
    }
  }, [children, id, query]);

  // Sensors cho dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag end - sắp xếp lại element
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setElementIds((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Cập nhật thứ tự trong Craft.js
        newOrder.forEach((nodeId, index) => {
          actions.move(nodeId, id, index);
        });

        return newOrder;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={elementIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={(ref) => {
            if (ref) {
              connect(ref);
            }
          }}
          onClick={(e) => {
            // Chỉ dừng propagation nếu click vào chính container, không phải children
            if (e.target === e.currentTarget) {
              e.stopPropagation();
            }
          }}
          className={`w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4 transition-all user-select-none ${
            isSelected ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            minHeight: "400px",
            position: "relative",
          }}
        >
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
}

FormContainer.craft = {
  displayName: "Form Container",
  props: {},
  rules: {
    canDrag: () => false,
    canMoveIn: (incomingNodes) => true,
  },
};
