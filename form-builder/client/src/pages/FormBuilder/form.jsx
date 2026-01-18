import { Editor, Frame, Element } from "@craftjs/core";
import { useEditor } from "@craftjs/core";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import BuilderHeader from "./BuilderHeader";
import FieldSidebar from "./FieldSidebar";
import BuilderCanvas from "./BuilderCanvas";
import { TextField } from "@/components/form-elements/TextField";
import { Textarea } from "@/components/form-elements/Textarea";
import {
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { Button } from "@/components/form-elements/Button";
import { Title } from "@/components/form-elements/Title";
import { Text } from "@/components/form-elements/Text";
import { FormContainer } from "@/components/form-elements/FormContainer";
import SettingsPanel from "./SettingPanel";
import { DragIndicatorProvider } from "@/context/DragIndicatorContext";
import "@/styles/responsive.css";

// Định nghĩa resolver bên ngoài để tránh re-render
const resolverConfig = {
  TextField,
  Textarea,
  Button,
  Title,
  Text,
  FormContainer,
};

function EditorContent({ formId, initialFormName }) {
  const { actions, query } = useEditor();
  const [isLoading, setIsLoading] = useState(formId && formId !== "new");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ⚠️ Tất cả hooks PHẢI được gọi ở đầu theo cùng thứ tự mỗi render
  // Cấu hình sensors cho dnd-kit (chỉ dùng cho sidebar) - PHẢI ở đây
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load form data khi component mount
  useEffect(() => {
    if (formId && formId !== "new") {
      loadFormData();
    }
  }, [formId]);

  const loadFormData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Gọi API lấy form theo ID
      const response = await fetch(
        `http://localhost:3000/api/forms/${formId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải form");
      }

      const form = await response.json();

      // Load form structure vào Editor
      if (form.schema) {
        actions.deserialize(form.schema);
      }
    } catch (error) {
      console.error("Lỗi khi tải form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang tải form...</p>
      </div>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log("🎯 handleDragEnd fired!", {
      active: active?.id,
      over: over?.id,
    });

    // Chỉ xử lý drag từ sidebar
    if (!active || !active.id || !active.id.startsWith("field-")) {
      console.log("❌ Skipped: Not a field drag");
      return;
    }

    if (!over) {
      console.log("⚠️ Warning: No over target");
    }

    try {
      let component;
      let props;
      const fieldType = active.id.replace("field-", "");

      switch (fieldType) {
        case "input":
          component = TextField;
          props = { label: "Input Field" };
          break;

        case "textarea":
          component = Textarea;
          props = {
            label: "Textarea",
            placeholder: "Nhập văn bản...",
            rows: 4,
          };
          break;

        case "button":
          component = Button;
          props = {
            text: "Submit",
            variant: "primary",
            size: "md",
            alignment: "full",
            customWidth: "",
            customHeight: "",
          };
          break;

        case "title":
          component = Title;
          props = { text: "Tiêu đề Form", size: "h2" };
          break;

        case "text":
          component = Text;
          props = { content: "Văn bản mô tả", align: "left", color: "gray" };
          break;

        default:
          return;
      }

      // Tìm FormContainer ID
      const state = query.getState();
      let formContainerId = null;

      for (const nodeId in state.nodes) {
        const node = state.nodes[nodeId];
        if (node.data?.name === "FormContainer") {
          formContainerId = nodeId;
          break;
        }
      }

      const targetParent = formContainerId || "ROOT";

      console.log("📝 Adding new element:", {
        componentName: component.name,
        props,
        targetParent,
      });

      // Thêm element vào Craft.js editor
      const nodeTree = query
        .parseReactElement(React.createElement(component, props))
        .toNodeTree();

      actions.addNodeTree(nodeTree, targetParent);
      console.log("✅ Element added successfully");
    } catch (error) {
      console.error("❌ Error in handleDragEnd:", error);
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <div className="h-screen flex flex-col bg-white">
        {/* HEADER */}
        <BuilderHeader formId={formId} initialFormName={initialFormName} />

        {/* MAIN CONTENT - FLEX ROW */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* SIDEBAR BÊN TRÁI - DND-KIT ONLY */}
          <div className="w-52 border-r bg-white overflow-y-auto flex-shrink-0 z-10">
            <FieldSidebar />
          </div>

          {/* CANVAS CHÍNH - CRAFT.JS DRAG ONLY */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <BuilderCanvas isPreviewOpen={isPreviewOpen}>
              <Frame>
                <Element is={FormContainer} canvas />
              </Frame>
            </BuilderCanvas>
          </div>

          {/* SETTINGS PANEL BÊN PHẢI */}
          <div className="w-72 border-l bg-white overflow-y-auto flex-shrink-0 z-10">
            <SettingsPanel />
          </div>
        </div>

        {/* DRAG OVERLAY */}
        <DragOverlay />
      </div>
    </DndContext>
  );
}

export default function FormBuilder() {
  const { formId } = useParams(); // Lấy formId từ URL (nếu có)
  const [initialFormName, setInitialFormName] = useState("Form không tên");

  return (
    <DragIndicatorProvider>
      <div className="h-screen flex flex-col">
        {/* 
          GIẢI THÍCH EDITOR RESOLVER:
          - resolver: Là object chứa tất cả components có thể dùng trong form builder
          - Craft.js cần biết tất cả component để có thể render và chỉnh sửa
          - Nếu component không trong resolver -> craft.js sẽ không biết cách render
        */}
        <Editor resolver={resolverConfig}>
          <EditorContent formId={formId} initialFormName={initialFormName} />
        </Editor>
      </div>
    </DragIndicatorProvider>
  );
}
